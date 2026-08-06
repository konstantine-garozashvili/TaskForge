/**
 * Icones TaskForge — traits fins 1.5px, 18px, currentColor.
 * Pas d'emoji dans l'UI : des SVG sobres et cohérents.
 */
const Icon = ({ children, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconTicket = (props) => (
  <Icon {...props}>
    <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z" />
    <path d="M13 5v2M13 11v2M13 17v2" />
  </Icon>
);

export const IconChart = (props) => (
  <Icon {...props}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 14l4-4 4 3 5-6" />
  </Icon>
);

export const IconUsers = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3.5 20c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M16 5.5a3.5 3.5 0 0 1 0 5.8M18.5 15.6c1.3.7 2.2 2 2.5 4.4" />
  </Icon>
);

export const IconLogout = (props) => (
  <Icon {...props}>
    <path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
    <path d="M17 8l4 4-4 4M9 12h12" />
  </Icon>
);

export const IconPlus = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconCheck = (props) => (
  <Icon {...props}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
);

export const IconAlert = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5v.5" />
  </Icon>
);

export const IconInfo = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5V8" />
  </Icon>
);

export const IconPencil = (props) => (
  <Icon {...props}>
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
  </Icon>
);

export const IconTrash = (props) => (
  <Icon {...props}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
  </Icon>
);

export const IconClose = (props) => (
  <Icon {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);
