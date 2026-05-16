let books = JSON.parse(localStorage.getItem('emberAndInk')) || [];

// Pre-loaded books if library is empty
const preLoadedBooks = [
  { title: "The Stranger", author: "Albert Camus", poem: "I opened myself to the gentle indifference of the world." },
  { title: "The Metamorphosis", author: "Franz Kafka", poem: "I cannot make anyone understand what is happening inside me." },
  { title: "Jane Eyre", author: "Charlotte Bronte", poem: "I am no bird and no net ensnares me. I am a free human being." },
  { title: "Pride and Prejudice", author: "Jane Austen", poem: "It is a truth universally acknowledged that a single man must be in want of a wife." },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", poem: "So we beat on, boats against the current, borne back ceaselessly into the past." },
  { title: "Kafka on the Shore", author: "Haruki Murakami", poem: "When you come out of the storm, you won't be the same person who walked in." },
  { title: "No Exit", author: "Jean-Paul Sartre", poem: "Hell is other people." },
  { title: "Wuthering Heights", author: "Emily Bronte", poem: "Whatever our souls are made of, his and mine are the same." },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", poem: "Pain and suffering are always inevitable for a deep heart." },
  { title: "The Picture of Dorian Gray", author: "Oscar Wilde", poem: "The only way to get rid of a temptation is to yield to it." }
];

// Only add pre-loaded books if localStorage is empty (first time user)
if (books.length === 0) {
  books = preLoadedBooks;
  saveBooks();
}

function saveBooks() {
  localStorage.setItem('emberAndInk', JSON.stringify(books));
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function displayBooks(filter = '') {
  const grid = document.getElementById('booksGrid');
  if (!grid) return;
  
  let filteredBooks = books;
  if (filter) {
    filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(filter.toLowerCase()) || 
      book.poem.toLowerCase().includes(filter.toLowerCase())
    );
  }
  
  if (filteredBooks.length === 0) {
    grid.innerHTML = '<div class="empty-message">Ember & Ink is empty. Add your first book.</div>';
    return;
  }
  
  grid.innerHTML = filteredBooks.map((book, idx) => {
    const originalIndex = books.findIndex(b => b.title === book.title && b.poem === book.poem);
    return `
    <div class="book-card" data-index="${originalIndex}">
      <div class="book-title">${escapeHtml(book.title)}</div>
      <div class="book-author">${escapeHtml(book.author) || 'Unknown author'}</div>
      <div class="book-poem">"${escapeHtml(book.poem) || 'No poem yet'}"</div>
      <div class="card-buttons">
        <button class="edit-btn" onclick="editBook(${originalIndex})">Edit</button>
        <button class="delete-btn" onclick="deleteBook(${originalIndex})">Delete</button>
      </div>
    </div>
    `;
  }).join('');
}

function addBook() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const poem = document.getElementById('bookPoem').value.trim();
  
  if (!title) {
    alert('Please enter a book title');
    return;
  }
  
  books.push({
    title: title,
    author: author,
    poem: poem || 'No poem yet'
  });
  
  saveBooks();
  displayBooks(document.getElementById('searchInput')?.value || '');
  
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookPoem').value = '';
}

function editBook(index) {
  const book = books[index];
  const newTitle = prompt('Edit book title:', book.title);
  if (newTitle !== null && newTitle.trim()) {
    book.title = newTitle.trim();
  }
  const newAuthor = prompt('Edit author:', book.author);
  if (newAuthor !== null) {
    book.author = newAuthor.trim();
  }
  const newPoem = prompt('Edit your poem or note:', book.poem);
  if (newPoem !== null) {
    book.poem = newPoem.trim() || 'No poem yet';
  }
  
  saveBooks();
  displayBooks(document.getElementById('searchInput')?.value || '');
}

function deleteBook(index) {
  if (confirm('Remove this book from Ember & Ink?')) {
    books.splice(index, 1);
    saveBooks();
    displayBooks(document.getElementById('searchInput')?.value || '');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayBooks();
  
  const addBtn = document.getElementById('addBtn');
  if (addBtn) {
    addBtn.addEventListener('click', addBook);
  }
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      displayBooks(e.target.value);
    });
  }
});
