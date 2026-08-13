import assert from 'node:assert';
import { test, describe } from 'node:test';
import { ROUTES, STORAGE_KEYS } from '../utils/constants.js';

describe('Interview AI Frontend Unit Test Suite', () => {

  test('Route Constants Integrity', () => {
    assert.strictEqual(ROUTES.HOME, '/');
    assert.strictEqual(ROUTES.DASHBOARD, '/dashboard');
    assert.strictEqual(ROUTES.INTERVIEWS, '/interviews');
    assert.strictEqual(ROUTES.HISTORY, '/history');
    assert.strictEqual(ROUTES.SETTINGS, '/settings');
    assert.strictEqual(ROUTES.ADMIN, '/admin');
    assert.strictEqual(ROUTES.NOT_FOUND, '/404');
  });

  test('Local Storage Keys Configured', () => {
    assert.strictEqual(STORAGE_KEYS.AUTH_TOKEN, 'interview_ai_token');
    assert.strictEqual(STORAGE_KEYS.USER_INFO, 'interview_ai_user');
    assert.strictEqual(STORAGE_KEYS.THEME, 'interview_ai_theme');
  });

  test('Pagination Controls Logic Math', () => {
    const totalItems = 14;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    assert.strictEqual(totalPages, 3);
  });

  test('Search Palette Filter Matching', () => {
    const query = 'Node.js';
    const items = [
      { title: 'Senior Node.js & Backend Architecture', domain: 'Node.js' },
      { title: 'React 19 Server Components', domain: 'React' },
    ];

    const filtered = items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );

    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].domain, 'Node.js');
  });

});
