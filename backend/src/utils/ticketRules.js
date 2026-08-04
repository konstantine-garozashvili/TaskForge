/**
 * Règles métier des tickets — fonctions pures (CDC §7).
 *
 * Source de vérité partagée, réutilisée par le CRUD tickets (#6/#8)
 * et couverte par les tests unitaires. Les valeurs sont alignées sur
 * database/schema.sql (MPD Merise) : status VARCHAR(15) CHECK ...,
 * priority VARCHAR(10) CHECK ...
 */

export const TICKET_STATUSES = ['ouvert', 'en_cours', 'resolu', 'ferme'];
export const TICKET_PRIORITIES = ['basse', 'moyenne', 'haute', 'critique'];

/**
 * Transitions de statut autorisées (CDC §7 : ouvert → en cours → résolu).
 * - ouvert   → en_cours (prise en charge)
 * - en_cours → resolu (résolution, renseigne resolved_at — RG4)
 *             ou ouvert (désassignation / remise en attente)
 * - resolu   → ferme (clôture) ou en_cours (réouverture)
 * - ferme    → état terminal
 */
const ALLOWED_TRANSITIONS = {
  ouvert: ['en_cours'],
  en_cours: ['ouvert', 'resolu'],
  resolu: ['en_cours', 'ferme'],
  ferme: [],
};

/**
 * Vérifie si une transition de statut est autorisée.
 * @param {string} from - statut actuel
 * @param {string} to - statut cible
 * @returns {boolean}
 */
export const isValidStatusTransition = (from, to) =>
  Array.isArray(ALLOWED_TRANSITIONS[from]) && ALLOWED_TRANSITIONS[from].includes(to);

/**
 * Liste les statuts atteignables depuis un statut donné.
 * @param {string} status
 * @returns {string[]} copie du tableau des transitions autorisées
 */
export const nextStatuses = (status) => [...(ALLOWED_TRANSITIONS[status] ?? [])];

/**
 * Calcule le temps moyen de résolution (ms) d'une liste de tickets.
 * Seuls les tickets résolus avec des dates valides comptent ;
 * resolved_at < created_at est ignoré (donnée incohérente).
 *
 * @param {Array<{created_at: string|Date, resolved_at: string|Date|null}>} tickets
 * @returns {number} moyenne en millisecondes, 0 si aucun ticket résolu
 */
export const averageResolutionTimeMs = (tickets) => {
  const durations = (tickets ?? [])
    .map((ticket) => {
      if (!ticket?.created_at || !ticket?.resolved_at) return null;
      const duration =
        new Date(ticket.resolved_at).getTime() - new Date(ticket.created_at).getTime();
      return Number.isFinite(duration) && duration >= 0 ? duration : null;
    })
    .filter((duration) => duration !== null);

  if (durations.length === 0) return 0;
  return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
};
