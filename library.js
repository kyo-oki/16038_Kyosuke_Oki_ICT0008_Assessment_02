const readline = require('node:readline');
const Book = require('./book');

const books = [
  new Book('Dune', 'Frank Herbert', '9780441172719', '2026-02-10'),
  new Book('Pride and Prejudice', 'Jane Austen', '9780141439518', '2025-09-12'),
  new Book('The Hobbit', 'J. R. R. Tolkien', '9780547928227', '2026-03-04'),
  new Book('1984', 'George Orwell', '9780451524935', '2025-10-17'),
  new Book('Frankenstein', 'Mary Shelley', '9780486282114', '2026-01-09'),
];

Book.sortBookData(books);
console.log('ISBN | Title | Author | Date added | Status');
for (const book of books) console.log(book.displayBookDetails());
console.log('Enter an ISBN to borrow, return ISBN to return, or 0 to exit.');
const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });

async function run() {
  terminal.setPrompt('ISBN> ');
  terminal.prompt();
  for await (const line of terminal) {
    const input = line.trim();
    if (input === '0') {
      console.log('Goodbye.');
      break;
    }
    const match = /^(?:(return)\s+)?(\d{13})$/i.exec(input);
    if (!match) {
      console.log('Error: enter a 13-digit ISBN, return ISBN, or 0.');
    } else {
      const book = books.find(item => item.isbn === match[2]);
      if (!book) console.log('Error: ISBN not found.');
      else if (match[1]) {
        if (book.returnBook()) console.log('Returned:', book.displayBookDetails());
        else console.log('Error: this book is already available.');
      } else if (book.borrowBook()) console.log('Borrowed:', book.displayBookDetails());
      else console.log('Error: this book is already borrowed.');
    }
    terminal.prompt();
  }
  terminal.close();
}
run();
