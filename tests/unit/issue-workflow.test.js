import { readFileSync } from 'node:fs';

const workflow = readFileSync(
  new URL('../../.github/workflows/issue-opened.yml', import.meta.url),
  'utf8',
);
const editGuard = workflow.match(
  /if \((payload\.changes && !Object\.hasOwn\(payload\.changes, 'body'\))\) \{/,
);

describe('issue edited workflow guard', () => {
  test('skips title-only edits without dereferencing a missing body change', () => {
    expect(editGuard).not.toBeNull();
    const shouldSkip = new Function('payload', `return ${editGuard[1]};`);

    expect(shouldSkip({ changes: { title: { from: 'old' } } })).toBe(true);
    expect(shouldSkip({ changes: { body: { from: 'old' } } })).toBe(false);
  });
});
