const assert = require('node:assert/strict');
const { test } = require('node:test');
const { spawnSync } = require('node:child_process');
const Book = require('./book');

test('set, display, borrow, reject duplicate and return', () => {
  const book = new Book('A', 'B', '001', '2025-01-01');
  book.setBookDetails('New', 'Writer', '002', '2026-01-01');
  assert.equal(book.displayBookDetails(), '002 | New | Writer | 2026-01-01 | Available');
  assert.equal(book.borrowBook(), true);
  assert.equal(book.borrowBook(), false);
  assert.equal(book.returnBook(), true);
  assert.equal(book.returnBook(), false);
});

test('sort ISBNs without changing the number of books', () => {
  const books = ['003', '001', '002'].map(isbn => new Book('T', 'A', isbn, '2026-01-01'));
  Book.sortBookData(books);
  assert.deepEqual(books.map(book => book.isbn), ['001', '002', '003']);
});

test('five sorted books, input errors, state changes and exit', () => {
  const isbn = '9780441172719';
  const inputs = [isbn, isbn, 'return ' + isbn, 'return ' + isbn, isbn,
    '9999999999999', 'abc', '0', 'after exit'];
  const run = spawnSync(process.execPath, [require.resolve('./library')], {
    input: inputs.join('\n') + '\n', encoding: 'utf8'
  });
  assert.equal(run.status, 0);
  const catalogue = [...run.stdout.matchAll(/^(\d{13}) \|/gm)].map(m => m[1]);
  assert.equal(new Set(catalogue).size, 5);
  assert.deepEqual(catalogue, [...catalogue].sort());
  for (const expected of ['already borrowed', 'Returned:', 'already available',
    'ISBN not found', 'enter a 13-digit ISBN']) assert.ok(run.stdout.includes(expected));
  assert.equal((run.stdout.match(/Borrowed:/g) || []).length, 2);
  assert.ok(run.stdout.trimEnd().endsWith('Goodbye.'));
});
