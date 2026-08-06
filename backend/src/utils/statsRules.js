/**
 * Règles d'agrégation pour le dashboard (CDC §5) — fonctions pures.
 *
 * Consommées par le controller `stats.controller.js`, qui se contente de
 * charger les lignes brutes de `tickets` puis de leur appliquer ces
 * fonctions. Aucune dépendance à la CRUD tickets (#6/#8) : fonctionne aussi
 * bien sur une table vide qu'une table peuplée.
 */
import { TICKET_STATUSES, TICKET_PRIORITIES } from './ticketRules.js';

export const VALID_PERIODS = ['day', 'week', 'month'];

/**
 * Compte les tickets par statut. Toutes les clés de TICKET_STATUSES sont
 * présentes (0 par défaut) ; les statuts inconnus sont ignorés.
 * @param {Array<{status: string}>} tickets
 * @returns {Record<string, number>}
 */
export const countByStatus = (tickets) => {
  const counts = Object.fromEntries(TICKET_STATUSES.map((status) => [status, 0]));
  for (const ticket of tickets ?? []) {
    if (Object.prototype.hasOwnProperty.call(counts, ticket?.status)) {
      counts[ticket.status] += 1;
    }
  }
  return counts;
};

/**
 * Compte les tickets par priorité. Toutes les clés de TICKET_PRIORITIES
 * sont présentes (0 par défaut) ; les priorités inconnues sont ignorées.
 * @param {Array<{priority: string}>} tickets
 * @returns {Record<string, number>}
 */
export const countByPriority = (tickets) => {
  const counts = Object.fromEntries(TICKET_PRIORITIES.map((priority) => [priority, 0]));
  for (const ticket of tickets ?? []) {
    if (Object.prototype.hasOwnProperty.call(counts, ticket?.priority)) {
      counts[ticket.priority] += 1;
    }
  }
  return counts;
};

/** Numéro de semaine ISO-8601 (1-53) de la date donnée. */
const isoWeek = (date) => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Jeudi de la semaine ISO courante détermine l'année ISO
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { isoYear: d.getUTCFullYear(), week };
};

/**
 * Clé de bucket pour une date et une granularité données.
 * @param {Date} date
 * @param {'day'|'week'|'month'} granularity
 * @returns {string} 'YYYY-MM-DD' | 'YYYY-Www' | 'YYYY-MM'
 */
const bucketKey = (date, granularity) => {
  if (granularity === 'month') {
    return date.toISOString().slice(0, 7);
  }
  if (granularity === 'week') {
    const { isoYear, week } = isoWeek(date);
    return `${isoYear}-W${String(week).padStart(2, '0')}`;
  }
  return date.toISOString().slice(0, 10);
};

/**
 * Regroupe les tickets par période (jour/semaine/mois) selon un champ date,
 * triés par période croissante. Les lignes sans date valide sur `dateField`
 * sont ignorées.
 *
 * @param {Array<Record<string, unknown>>} tickets
 * @param {'day'|'week'|'month'} granularity
 * @param {string} dateField - nom du champ date ('created_at', 'resolved_at'...)
 * @returns {Array<{period: string, count: number}>}
 */
export const groupByPeriod = (tickets, granularity, dateField) => {
  const buckets = new Map();

  for (const ticket of tickets ?? []) {
    const raw = ticket?.[dateField];
    if (!raw) continue;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) continue;

    const key = bucketKey(date, VALID_PERIODS.includes(granularity) ? granularity : 'day');
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([period, count]) => ({ period, count }));
};
