import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { countByStatus, countByPriority, groupByPeriod } from '../src/utils/statsRules.js';

describe('statsRules — répartition par statut / priorité (CDC §5)', () => {
  it('compte les tickets par statut avec toutes les clés zéro-initialisées', () => {
    const tickets = [
      { status: 'ouvert' },
      { status: 'ouvert' },
      { status: 'resolu' },
      { status: 'ferme' },
    ];
    assert.deepEqual(countByStatus(tickets), {
      ouvert: 2,
      en_cours: 0,
      resolu: 1,
      ferme: 1,
    });
  });

  it('ignore les statuts inconnus et supporte les entrées vides', () => {
    assert.deepEqual(countByStatus([{ status: 'inexistant' }, { status: 'ouvert' }]), {
      ouvert: 1,
      en_cours: 0,
      resolu: 0,
      ferme: 0,
    });
    assert.deepEqual(countByStatus([]), { ouvert: 0, en_cours: 0, resolu: 0, ferme: 0 });
    assert.deepEqual(countByStatus(undefined), { ouvert: 0, en_cours: 0, resolu: 0, ferme: 0 });
  });

  it('compte les tickets par priorité avec toutes les clés zéro-initialisées', () => {
    const tickets = [{ priority: 'critique' }, { priority: 'basse' }, { priority: 'basse' }];
    assert.deepEqual(countByPriority(tickets), {
      basse: 2,
      moyenne: 0,
      haute: 0,
      critique: 1,
    });
  });

  it('ignore les priorités inconnues', () => {
    assert.deepEqual(countByPriority([{ priority: 'urgentissime' }]), {
      basse: 0,
      moyenne: 0,
      haute: 0,
      critique: 0,
    });
  });
});

describe('statsRules — agrégation par période (CDC §5)', () => {
  it('regroupe par jour et trie les buckets par ordre croissant', () => {
    const tickets = [
      { created_at: '2026-08-02T09:00:00Z' },
      { created_at: '2026-08-01T08:00:00Z' },
      { created_at: '2026-08-01T20:00:00Z' },
    ];
    assert.deepEqual(groupByPeriod(tickets, 'day', 'created_at'), [
      { period: '2026-08-01', count: 2 },
      { period: '2026-08-02', count: 1 },
    ]);
  });

  it('regroupe par mois', () => {
    const tickets = [
      { created_at: '2026-08-01T00:00:00Z' },
      { created_at: '2026-08-30T00:00:00Z' },
      { created_at: '2026-09-01T00:00:00Z' },
    ];
    assert.deepEqual(groupByPeriod(tickets, 'month', 'created_at'), [
      { period: '2026-08', count: 2 },
      { period: '2026-09', count: 1 },
    ]);
  });

  it('regroupe par semaine ISO', () => {
    // 2026-08-03 est un lundi (semaine ISO 32), 2026-08-10 la semaine suivante (33)
    const tickets = [
      { created_at: '2026-08-03T00:00:00Z' },
      { created_at: '2026-08-05T00:00:00Z' },
      { created_at: '2026-08-10T00:00:00Z' },
    ];
    assert.deepEqual(groupByPeriod(tickets, 'week', 'created_at'), [
      { period: '2026-W32', count: 2 },
      { period: '2026-W33', count: 1 },
    ]);
  });

  it('ignore les lignes sans date valide sur le champ demandé', () => {
    const tickets = [
      { created_at: '2026-08-01T00:00:00Z', resolved_at: null },
      { created_at: '2026-08-01T00:00:00Z', resolved_at: '2026-08-02T00:00:00Z' },
      { created_at: '2026-08-01T00:00:00Z' },
    ];
    assert.deepEqual(groupByPeriod(tickets, 'day', 'resolved_at'), [
      { period: '2026-08-02', count: 1 },
    ]);
  });

  it('retourne un tableau vide sans données', () => {
    assert.deepEqual(groupByPeriod([], 'day', 'created_at'), []);
    assert.deepEqual(groupByPeriod(undefined, 'day', 'created_at'), []);
  });
});
