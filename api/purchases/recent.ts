/**
 * api/purchases/recent.ts
 * Vercel Serverless Function — template de integração com processador de pagamentos
 *
 * INSTALAÇÃO NECESSÁRIA:
 *   npm install @vercel/node --save-dev
 *
 * ACTIVAÇÃO:
 *   Substituir o bloco "TODO" abaixo pela consulta real ao sistema de pagamentos.
 *   Após o deploy, o endpoint ficará disponível em: /api/purchases/recent
 *
 * SEGURANÇA:
 *   — Números de telefone completos e dados financeiros nunca chegam ao browser.
 *   — A função mascara os números antes de devolver a resposta.
 *   — Credenciais ficam em variáveis de ambiente no painel da Vercel.
 *
 * FORMATO DE RESPOSTA:
 *   Array de PurchaseNotif (definido em src/PurchaseNotification.tsx).
 *   Devolve [] quando não há compras elegíveis — sem erros no cliente.
 */

// Instale: npm install @vercel/node --save-dev
// import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Tipo da resposta ──────────────────────────────────────────────────────────
interface PurchaseNotif {
  id: string;
  canShowPersonal: boolean;
  firstName?: string;
  maskedPhone?: string;
  wallet: 'M-Pesa' | 'e-Mola';
  confirmedAt: string; // ISO-8601
}

// ── Helper: mascara número de telemóvel no servidor ───────────────────────────
// Entrada:  "258871234567" ou "+258 87 123 45 67"
// Saída:    "+258 87 *** ** 67"
function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9) return '***';
  const cc   = digits.startsWith('258') ? digits.slice(0, 3) : '258';
  const net  = digits.startsWith('258') ? digits.slice(3, 5) : digits.slice(0, 2);
  const last = digits.slice(-2);
  return `+${cc} ${net} *** ** ${last}`;
}

// ── Helper: normaliza método de pagamento para carteira ──────────────────────
// Baseia-se no campo de método de pagamento da transacção,
// NÃO no prefixo do número de telefone.
function toWallet(paymentMethod: string): 'M-Pesa' | 'e-Mola' | null {
  const m = paymentMethod.toLowerCase();
  if (m.includes('mpesa') || m.includes('m-pesa'))  return 'M-Pesa';
  if (m.includes('emola') || m.includes('e-mola'))  return 'e-Mola';
  return null; // método desconhecido — não mostrar notificação
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  // Apenas GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Headers de segurança
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Restringir a origem em produção:
  // res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN ?? 'https://paudecavalo.vercel.app');

  try {
    // ══════════════════════════════════════════════════════════════════════════
    // TODO: Substituir por consulta real ao seu processador de pagamentos.
    //
    // OPÇÃO A — Zenofy (webhook guardado em base de dados):
    //   const db = getDb(); // ex: Firebase Admin, Supabase, PlanetScale
    //   const rows = await db.collection('purchases')
    //     .where('status', '==', 'confirmed')
    //     .where('confirmedAt', '>=', new Date(Date.now() - 3_600_000)) // última 1 h
    //     .orderBy('confirmedAt', 'desc')
    //     .limit(20)
    //     .get();
    //
    // OPÇÃO B — Consulta directa à API da Zenofy:
    //   const response = await fetch('https://api.zenofy.io/v1/orders?status=confirmed', {
    //     headers: { Authorization: `Bearer ${process.env.ZENOFY_API_KEY}` }
    //   });
    //   const rows = await response.json();
    //
    // CAMPOS ESPERADOS POR TRANSACÇÃO (adaptar ao modelo da sua plataforma):
    //   id              — identificador único da ordem
    //   status          — usar apenas 'confirmed' / 'paid'; excluir pending/failed/refunded
    //   customerName    — nome completo (usamos apenas o primeiro)
    //   customerPhone   — número completo (mascaramos aqui; nunca enviamos completo)
    //   paymentMethod   — string: 'mpesa', 'emola', etc.
    //   paidAt          — timestamp ISO-8601 da confirmação
    //   consentMarketing— boolean: autorização para divulgar dados pessoais (RGPD/LGPD)
    //
    // EXEMPLO DE TRANSFORMAÇÃO:
    //   const purchases: PurchaseNotif[] = rows.map((row: any) => {
    //     const wallet = toWallet(row.paymentMethod);
    //     if (!wallet) return null; // ignorar métodos desconhecidos
    //     return {
    //       id:             row.id,
    //       canShowPersonal: row.consentMarketing === true,
    //       firstName:      row.consentMarketing ? row.customerName.split(' ')[0] : undefined,
    //       maskedPhone:    row.consentMarketing ? maskPhone(row.customerPhone) : undefined,
    //       wallet,
    //       confirmedAt:    row.paidAt,
    //     };
    //   }).filter(Boolean);
    //
    // ══════════════════════════════════════════════════════════════════════════

    // Sem integração activa → devolve lista vazia.
    // O componente front-end não mostrará notificações em produção até este
    // bloco ser substituído pela consulta real.
    const purchases: PurchaseNotif[] = [];

    res.status(200).json(purchases);
  } catch (error) {
    console.error('[api/purchases/recent] Erro:', error);
    // Devolve lista vazia em vez de erro — o cliente falha silenciosamente
    res.status(200).json([]);
  }
}

// Exportar helpers para uso em testes unitários
export { maskPhone, toWallet };
