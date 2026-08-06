import pool from '../config/db.js';
import { averageResolutionTimeMs } from '../utils/ticketRules.js';
import {
  VALID_PERIODS,
  countByStatus,
  countByPriority,
  groupByPeriod,
} from '../utils/statsRules.js';

/**
 * GET /api/stats (dashboard — CDC §5)
 * Query: ?period=day|week|month (default 'day')
 *
 * Répartition des tickets par statut et priorité, temps moyen de
 * résolution, et agrégation du volume de tickets créés/résolus par
 * période. Fonctionne aussi bien sur une table vide (tout à 0) que peuplée
 * — indépendant de la CRUD tickets (#6/#8), qui n'existe pas encore.
 */
export const getStats = async (req, res, next) => {
  try {
    const period = VALID_PERIODS.includes(req.query.period) ? req.query.period : 'day';

    const { rows: tickets } = await pool.query(
      'SELECT status, priority, created_at, resolved_at FROM tickets',
    );
    const resolvedTickets = tickets.filter((ticket) => ticket.resolved_at);

    res.json({
      total: tickets.length,
      byStatus: countByStatus(tickets),
      byPriority: countByPriority(tickets),
      averageResolutionTimeMs: averageResolutionTimeMs(tickets),
      period,
      createdByPeriod: groupByPeriod(tickets, period, 'created_at'),
      resolvedByPeriod: groupByPeriod(resolvedTickets, period, 'resolved_at'),
    });
  } catch (err) {
    next(err);
  }
};
