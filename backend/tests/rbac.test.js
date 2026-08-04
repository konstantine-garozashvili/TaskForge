import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { requireRole } from '../src/middleware/rbac.middleware.js';

/** Minimal res mock capturing status + body. */
const mockRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
};

describe('requireRole — hiérarchie RBAC (CDC §4)', () => {
  it('admin > technicien > utilisateur : un rôle supérieur passe toujours', () => {
    for (const required of ['utilisateur', 'technicien', 'admin']) {
      const res = mockRes();
      let called = false;
      requireRole(required)({ user: { role: 'admin' } }, res, () => (called = true));
      assert.equal(called, true, `admin devrait passer requireRole('${required}')`);
      assert.equal(res.statusCode, null);
    }
  });

  it('technicien passe requireRole technicien et utilisateur, pas admin', () => {
    let called = false;
    requireRole('technicien')({ user: { role: 'technicien' } }, mockRes(), () => (called = true));
    assert.equal(called, true);

    called = false;
    requireRole('utilisateur')({ user: { role: 'technicien' } }, mockRes(), () => (called = true));
    assert.equal(called, true);

    const res = mockRes();
    requireRole('admin')({ user: { role: 'technicien' } }, res, () => (called = true));
    assert.equal(res.statusCode, 403);
  });

  it('utilisateur ne passe que requireRole utilisateur', () => {
    for (const required of ['technicien', 'admin']) {
      const res = mockRes();
      requireRole(required)({ user: { role: 'utilisateur' } }, res, () => {});
      assert.equal(res.statusCode, 403);
      assert.match(res.body.error, new RegExp(required));
    }
  });

  it('refuse un rôle inconnu ou absent avec 403', () => {
    for (const user of [{ role: 'superadmin' }, {}, undefined]) {
      const res = mockRes();
      requireRole('utilisateur')({ user }, res, () => {});
      assert.equal(res.statusCode, 403);
      assert.match(res.body.error, /unknown role/);
    }
  });
});
