import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authenticate } from '../src/middleware/auth.middleware.js';
import config from '../src/config/index.js';

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

const reqWith = (authorization) => ({ headers: { authorization } });

describe('authenticate — middleware JWT (CDC §4)', () => {
  it('accepte un token valide et peuple req.user', () => {
    const token = jwt.sign({ sub: 42, email: 'a@b.c', role: 'technicien' }, config.jwt.secret, {
      expiresIn: '5m',
    });
    const req = reqWith(`Bearer ${token}`);
    let called = false;
    authenticate(req, mockRes(), () => (called = true));

    assert.equal(called, true);
    assert.deepEqual(req.user, { id: 42, email: 'a@b.c', role: 'technicien' });
  });

  it('rejette les en-têtes absents ou mal formés avec 401', () => {
    for (const header of [undefined, '', 'Bearer', 'Basic abc', 'Token abc']) {
      const res = mockRes();
      authenticate(reqWith(header), res, () => {});
      assert.equal(res.statusCode, 401, `header: ${header}`);
    }
  });

  it('rejette un token signé avec un mauvais secret', () => {
    const token = jwt.sign({ sub: 1, email: 'a@b.c', role: 'admin' }, 'mauvais-secret');
    const res = mockRes();
    authenticate(reqWith(`Bearer ${token}`), res, () => {});
    assert.equal(res.statusCode, 401);
    assert.match(res.body.error, /Invalid or expired/);
  });

  it('rejette un token expiré', () => {
    const token = jwt.sign({ sub: 1, email: 'a@b.c', role: 'admin' }, config.jwt.secret, {
      expiresIn: '-1s',
    });
    const res = mockRes();
    authenticate(reqWith(`Bearer ${token}`), res, () => {});
    assert.equal(res.statusCode, 401);
  });
});
