import { useEffect, useRef, useState, useCallback } from 'react';
import './PurchaseNotification.css';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface PurchaseNotif {
  /** Identificador único da transacção (para deduplicação na sessão) */
  id: string;
  /** true = autorização para mostrar dados pessoais; false = mostrar apenas "Um cliente" */
  canShowPersonal: boolean;
  /** Primeiro nome (já sanitizado pelo servidor). Apenas se canShowPersonal=true */
  firstName?: string;
  /** Número mascarado pelo servidor. Formato: "+258 87 *** ** 89" */
  maskedPhone?: string;
  /** Carteira móvel obtida do método de pagamento registado na transacção */
  wallet: 'M-Pesa' | 'e-Mola';
  /** ISO-8601 — timestamp de confirmação real do pagamento */
  confirmedAt: string;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const CHECK_INTERVAL_MS  = 45_000;
const VISIBLE_MS         = 7_000;
const EXIT_ANIMATION_MS  = 380;
const DEMO_FIRST_SHOW_MS = 3_000;
const API_ENDPOINT       = '/api/purchases/recent';

// ── Dados fictícios para modo demonstração ────────────────────────────────────
const DEMO_PURCHASES: PurchaseNotif[] = [
  {
    id: 'demo-1',
    canShowPersonal: true,
    firstName: 'Carlos',
    maskedPhone: '+258 87 *** ** 34',
    wallet: 'M-Pesa',
    confirmedAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: 'demo-2',
    canShowPersonal: true,
    firstName: 'Hélder',
    maskedPhone: '+258 84 *** ** 71',
    wallet: 'e-Mola',
    confirmedAt: new Date(Date.now() - 9 * 60_000).toISOString(),
  },
  {
    id: 'demo-3',
    canShowPersonal: false,
    wallet: 'M-Pesa',
    confirmedAt: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
  {
    id: 'demo-4',
    canShowPersonal: true,
    firstName: 'Adriano',
    maskedPhone: '+258 86 *** ** 22',
    wallet: 'e-Mola',
    confirmedAt: new Date(Date.now() - 22 * 60_000).toISOString(),
  },
  {
    id: 'demo-5',
    canShowPersonal: true,
    firstName: 'Tomás',
    maskedPhone: '+258 82 *** ** 55',
    wallet: 'M-Pesa',
    confirmedAt: new Date(Date.now() - 40 * 60_000).toISOString(),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(isoDate: string): string {
  const diff = Math.max(0, Date.now() - new Date(isoDate).getTime());
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'agora mesmo';
  if (mins < 60) return `há ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `há ${hrs}h`;
  return `há ${Math.floor(hrs / 24)} dias`;
}

function isDemoMode(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('notif_demo');
  } catch {
    return false;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────
function usePurchaseNotifications(demo: boolean) {
  const [current, setCurrent] = useState<PurchaseNotif | null>(null);
  const [visible, setVisible] = useState(false);

  const shown        = useRef<Set<string>>(new Set());
  const hideTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisible    = useRef(false);
  const isDismissing = useRef(false);

  const dismiss = useCallback(() => {
    isVisible.current    = false;
    isDismissing.current = true;
    setVisible(false);
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    setTimeout(() => {
      setCurrent(null);
      isDismissing.current = false;
    }, EXIT_ANIMATION_MS);
  }, []);

  const tryShow = useCallback((pool: PurchaseNotif[]) => {
    if (isVisible.current || isDismissing.current) return;
    const next = pool.find(p => !shown.current.has(p.id));
    if (!next) return;

    shown.current.add(next.id);
    isVisible.current = true;
    setCurrent(next);
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(dismiss, VISIBLE_MS);
  }, [dismiss]);

  useEffect(() => {
    let firstTimer: ReturnType<typeof setTimeout>;
    let interval:   ReturnType<typeof setInterval>;

    if (demo) {
      const pool = [...DEMO_PURCHASES];
      firstTimer = setTimeout(() => tryShow(pool), DEMO_FIRST_SHOW_MS);
      interval   = setInterval(() => tryShow(pool), CHECK_INTERVAL_MS);
    } else {
      const fetchAndTry = async () => {
        try {
          const res = await fetch(API_ENDPOINT);
          if (!res.ok) return;
          const data: unknown = await res.json();
          if (Array.isArray(data)) tryShow(data as PurchaseNotif[]);
        } catch {
          // falha silenciosa — sem notificação se API indisponível
        }
      };
      firstTimer = setTimeout(fetchAndTry, CHECK_INTERVAL_MS);
      interval   = setInterval(fetchAndTry, CHECK_INTERVAL_MS);
    }

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    };
  }, [demo, tryShow]);

  return { current, visible, dismiss };
}

// ── Componente ────────────────────────────────────────────────────────────────
export function PurchaseNotification() {
  const demo = isDemoMode();
  const { current, visible, dismiss } = usePurchaseNotifications(demo);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  if (!current) return null;

  const hasPersonal = current.canShowPersonal && current.firstName;

  return (
    <div
      className={`pn-card${visible ? ' pn-card--in' : ' pn-card--out'}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {demo && (
        <div className="pn-demo-badge" aria-label="Modo demonstração com dados fictícios">
          Demonstração — dados fictícios
        </div>
      )}

      <button
        className="pn-close"
        onClick={dismiss}
        aria-label="Fechar notificação"
        tabIndex={0}
      >
        ×
      </button>

      <div className="pn-header">
        <span className="pn-check-icon" aria-hidden="true">✓</span>
        <span className="pn-title">Compra confirmada</span>
      </div>

      <div className="pn-body">
        {hasPersonal ? (
          <>
            <p className="pn-line">
              <strong>{current.firstName}</strong> adquiriu
            </p>
            <p className="pn-product">O Segredo do Pau de Cavalo</p>
            {current.maskedPhone && (
              <p className="pn-phone">📱 {current.maskedPhone}</p>
            )}
          </>
        ) : (
          <>
            <p className="pn-line">
              <strong>Um cliente</strong> adquiriu
            </p>
            <p className="pn-product">O Segredo do Pau de Cavalo</p>
          </>
        )}

        <p className="pn-wallet">
          Pagamento via <strong>{current.wallet}</strong>
        </p>
      </div>

      <div className="pn-footer">
        <span className="pn-time">{timeAgo(current.confirmedAt)}</span>
      </div>
    </div>
  );
}
