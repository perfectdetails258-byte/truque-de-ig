// Declaração de tipos para o web component VTurb/ConverteAI
declare namespace JSX {
  interface IntrinsicElements {
    'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      id?: string;
    };
  }
}
