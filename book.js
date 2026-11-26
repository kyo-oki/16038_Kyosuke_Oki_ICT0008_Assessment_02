class Book {
  constructor(title, author, isbn, dateAdd, availability = true) {
    this.setBookDetails(title, author, isbn, dateAdd, availability);
  }

  setBookDetails(title, author, isbn, dateAdd, availability = true) {
    Object.assign(this, { title, author, isbn, dateAdd, availability });
  }

  displayBookDetails() {
    const status = this.availability ? 'Available' : 'Borrowed';
    return [this.isbn, this.title, this.author, this.dateAdd, status].join(' | ');
  }

  borrowBook() {
    if (!this.availability) return false;
    this.availability = false;
    return true;
  }

  returnBook() {
    if (this.availability) return false;
    this.availability = true;
    return true;
  }

  static sortBookData(books) {
    // Insertion sort compares the fixed-length ISBN strings in ascending order.
    for (let i = 1; i < books.length; i++) {
      const current = books[i];
      let j = i - 1;
      while (j >= 0 && books[j].isbn > current.isbn) {
        books[j + 1] = books[j];
        j--;
      }
      books[j + 1] = current;
    }
  }
}

module.exports = Book;
