/**
 * Marque TaskForge — ticket (helpdesk) + coche (résolution).
 * Version composant : la couleur suit le token --tf-blue, la taille suit le contexte.
 * Fichier maître pour usage hors-app (docs, PDF) : src/assets/logo.svg.
 */
export function LogoMark({ size = 28, className = '' }) {
  return (
    <svg
      className={`tf-logo-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6h20a4 4 0 0 1 4 4v3a3 3 0 0 0 0 6v3a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-3a3 3 0 0 0 0-6v-3a4 4 0 0 1 4-4Z"
        style={{ fill: 'var(--tf-blue)' }}
      />
      <path
        d="M11 16.2l3.3 3.4 7.2-7.4"
        fill="none"
        stroke="#fff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LogoMark;
