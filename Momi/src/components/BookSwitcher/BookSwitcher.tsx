import { useState } from 'react';
import { IoPencil, IoCheckmark } from 'react-icons/io5';
import { useRecipeBooks } from '../../context/RecipeBooksContext';
import styles from './BookSwitcher.module.scss';

// Book switcher component
export default function BookSwitcher() {
  const { books, activeBookId, activeBook, setActiveBookId, addBook, deleteBook, updateBook } = useRecipeBooks();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateBook = () => {
    if (newBookName.trim()) {
      addBook(newBookName.trim());
      setNewBookName('');
      setIsCreating(false);
    }
  };

  const handleDeleteBook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (books.length > 1 && confirm('Er du sikker på at du vil slette denne opskriftsbog?')) {
      deleteBook(id);
    }
  };

  const handleStartEdit = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBookId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      updateBook(id, { name: editName.trim() });
      setEditingBookId(null);
      setEditName('');
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBookId(null);
    setEditName('');
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch recipe book"
      >
        <div 
          className={styles.colorDot} 
          style={{ backgroundColor: activeBook?.color }}
        />
        <span className={styles.bookName}>{activeBook?.name || 'Vælg bog'}</span>
        <span className={styles.arrow}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <h3>Opskriftsbøger</h3>
            </div>
            
            <div className={styles.bookList}>
              {books.map(book => (
                <div
                  key={book.id}
                  className={`${styles.bookItem} ${book.id === activeBookId ? styles.active : ''}`}
                >
                  <div 
                    className={styles.bookInfo}
                    onClick={() => {
                      if (editingBookId !== book.id) {
                        setActiveBookId(book.id);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div 
                      className={styles.bookColor} 
                      style={{ backgroundColor: book.color }}
                    />
                    <div className={styles.bookDetails}>
                      {editingBookId === book.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(book.id, e as any)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className={styles.editInput}
                        />
                      ) : (
                        <>
                          <span className={styles.bookItemName}>{book.name}</span>
                          <span className={styles.bookStats}>
                            {book.recipes.length} opskrifter
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.bookActions}>
                    {editingBookId === book.id ? (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={(e) => handleSaveEdit(book.id, e)}
                          aria-label="Save book name"
                        >
                          <IoCheckmark />
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => handleCancelEdit(e)}
                          aria-label="Cancel edit"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={(e) => handleStartEdit(book.id, book.name, e)}
                          aria-label="Edit book name"
                        >
                          <IoPencil />
                        </button>
                        {books.length > 1 && (
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => handleDeleteBook(book.id, e)}
                            aria-label="Delete book"
                          >
                            ×
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!isCreating ? (
              <button 
                className={styles.createButton}
                onClick={() => setIsCreating(true)}
              >
                + Ny Opskriftsbog
              </button>
            ) : (
              <div className={styles.createForm}>
                <input
                  type="text"
                  placeholder="Navn på opskriftsbog"
                  value={newBookName}
                  onChange={(e) => setNewBookName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateBook()}
                  autoFocus
                  className={styles.createInput}
                />
                <div className={styles.createActions}>
                  <button 
                    className={styles.createConfirm}
                    onClick={handleCreateBook}
                    disabled={!newBookName.trim()}
                  >
                    Opret
                  </button>
                  <button 
                    className={styles.createCancel}
                    onClick={() => {
                      setIsCreating(false);
                      setNewBookName('');
                    }}
                  >
                    Annuller
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
