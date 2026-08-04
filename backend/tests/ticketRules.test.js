import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  isValidStatusTransition,
  nextStatuses,
  averageResolutionTimeMs,
} from '../src/utils/ticketRules.js';

describe('ticketRules — transitions de statut (CDC §7)', () => {
  it('accepte le parcours nominal ouvert → en_cours → resolu → ferme', () => {
    assert.equal(isValidStatusTransition('ouvert', 'en_cours'), true);
    assert.equal(isValidStatusTransition('en_cours', 'resolu'), true);
    assert.equal(isValidStatusTransition('resolu', 'ferme'), true);
  });

  it('accepte la remise en attente et la réouverture', () => {
    assert.equal(isValidStatusTransition('en_cours', 'ouvert'), true);
    assert.equal(isValidStatusTransition('resolu', 'en_cours'), true);
  });

  it('rejette les sauts de statut et les retours interdits', () => {
    assert.equal(isValidStatusTransition('ouvert', 'resolu'), false);
    assert.equal(isValidStatusTransition('ouvert', 'ferme'), false);
    assert.equal(isValidStatusTransition('en_cours', 'ferme'), false);
    assert.equal(isValidStatusTransition('ferme', 'ouvert'), false);
  });

  it('rejette les statuts inconnus et les transitions vers soi-même', () => {
    assert.equal(isValidStatusTransition('inexistant', 'ouvert'), false);
    assert.equal(isValidStatusTransition('ouvert', 'inexistant'), false);
    assert.equal(isValidStatusTransition('ouvert', 'ouvert'), false);
  });

  it('ferme est un état terminal', () => {
    assert.deepEqual(nextStatuses('ferme'), []);
  });

  it('nextStatuses reflète les transitions autorisées', () => {
    assert.deepEqual(nextStatuses('ouvert'), ['en_cours']);
    assert.deepEqual(nextStatuses('en_cours'), ['ouvert', 'resolu']);
    assert.deepEqual(nextStatuses('resolu'), ['en_cours', 'ferme']);
  });

  it('les constantes restent alignées sur le schéma SQL (MPD)', () => {
    assert.deepEqual(TICKET_STATUSES, ['ouvert', 'en_cours', 'resolu', 'ferme']);
    assert.deepEqual(TICKET_PRIORITIES, ['basse', 'moyenne', 'haute', 'critique']);
  });
});

describe('ticketRules — temps moyen de résolution (CDC §7)', () => {
  it('calcule la moyenne des durées de résolution', () => {
    const tickets = [
      { created_at: '2026-08-01T10:00:00Z', resolved_at: '2026-08-01T12:00:00Z' }, // 2h
      { created_at: '2026-08-02T10:00:00Z', resolved_at: '2026-08-02T14:00:00Z' }, // 4h
    ];
    assert.equal(averageResolutionTimeMs(tickets), 3 * 60 * 60 * 1000); // 3h
  });

  it('ignore les tickets non résolus', () => {
    const tickets = [
      { created_at: '2026-08-01T10:00:00Z', resolved_at: null },
      { created_at: '2026-08-01T10:00:00Z', resolved_at: '2026-08-01T11:00:00Z' },
    ];
    assert.equal(averageResolutionTimeMs(tickets), 60 * 60 * 1000);
  });

  it('ignore les dates incohérentes ou invalides', () => {
    const tickets = [
      { created_at: '2026-08-01T12:00:00Z', resolved_at: '2026-08-01T10:00:00Z' }, // négatif
      { created_at: 'pas une date', resolved_at: '2026-08-01T10:00:00Z' },
      { created_at: '2026-08-01T10:00:00Z', resolved_at: '2026-08-01T11:00:00Z' },
    ];
    assert.equal(averageResolutionTimeMs(tickets), 60 * 60 * 1000);
  });

  it('retourne 0 sans ticket résolu et supporte les entrées vides', () => {
    assert.equal(averageResolutionTimeMs([]), 0);
    assert.equal(averageResolutionTimeMs(undefined), 0);
    assert.equal(averageResolutionTimeMs([{ created_at: '2026-08-01T10:00:00Z' }]), 0);
  });
});
