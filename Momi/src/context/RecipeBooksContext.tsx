import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/LocalStorage';
import type { Recipe } from './RecipesContext';

export interface RecipeBook {
  id: string;
  name: string;
  color: string;
  recipes: Recipe[];
  categories: string[];
  createdAt: number;
}

interface RecipeBooksContextType {
  books: RecipeBook[];
  activeBookId: string;
  activeBook: RecipeBook | undefined;
  setActiveBookId: (id: string) => void;
  addBook: (name: string, color?: string) => void;
  deleteBook: (id: string) => void;
  updateBook: (id: string, data: Partial<RecipeBook>) => void;
  addRecipeToBook: (bookId: string, recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  updateRecipeInBook: (bookId: string, recipeId: string, updates: Partial<Recipe>) => void;
  deleteRecipeFromBook: (bookId: string, recipeId: string) => void;
  addCategoryToBook: (bookId: string, category: string) => boolean;
  importBook: (book: Omit<RecipeBook, 'id' | 'createdAt'>) => void;
}

const RecipeBooksContext = createContext<RecipeBooksContextType | undefined>(undefined);

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function RecipeBooksProvider({ children }: { children: ReactNode }) {
  // Migrate old data if it exists
  useEffect(() => {
    const oldRecipes = localStorage.getItem('recipes');
    const oldCategories = localStorage.getItem('categories');
    const existingBooks = localStorage.getItem('recipeBooks');
    
    // Only migrate if old data exists and no books have been created yet
    if ((oldRecipes || oldCategories) && !existingBooks) {
      const recipes: Recipe[] = oldRecipes ? JSON.parse(oldRecipes) : [];
      const categories: string[] = oldCategories ? JSON.parse(oldCategories) : [];
      
      const migratedBook: RecipeBook = {
        id: 'default',
        name: 'Mine Opskrifter',
        color: '#3b82f6',
        recipes,
        categories,
        createdAt: Date.now(),
      };
      
      localStorage.setItem('recipeBooks', JSON.stringify([migratedBook]));
      localStorage.setItem('activeBookId', JSON.stringify('default'));
      
      // Clean up old data
      localStorage.removeItem('recipes');
      localStorage.removeItem('categories');
    }
  }, []);

  const [books, setBooks] = useLocalStorage<RecipeBook[]>('recipeBooks', [
    {
      id: 'default',
      name: 'Mine Opskrifter',
      color: '#3b82f6',
      recipes: [],
      categories: [],
      createdAt: Date.now(),
    }
  ]);
  
  const [activeBookId, setActiveBookId] = useLocalStorage<string>('activeBookId', 'default');

  const activeBook = books.find(book => book.id === activeBookId);

  const addBook = (name: string, color?: string) => {
    const newBook: RecipeBook = {
      id: Date.now().toString(),
      name,
      color: color || DEFAULT_COLORS[books.length % DEFAULT_COLORS.length],
      recipes: [],
      categories: [],
      createdAt: Date.now(),
    };
    setBooks([...books, newBook]);
    setActiveBookId(newBook.id);
  };

  const deleteBook = (id: string) => {
    if (books.length === 1) return; // Don't delete last book
    const newBooks = books.filter(book => book.id !== id);
    setBooks(newBooks);
    if (activeBookId === id) {
      setActiveBookId(newBooks[0].id);
    }
  };

  const updateBook = (id: string, data: Partial<RecipeBook>) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...data } : book
    ));
  };

  const addRecipeToBook = (bookId: string, recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    
    setBooks(books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          recipes: [...book.recipes, newRecipe],
        };
      }
      return book;
    }));
  };

  const updateRecipeInBook = (bookId: string, recipeId: string, updates: Partial<Recipe>) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          recipes: book.recipes.map(recipe =>
            recipe.id === recipeId ? { ...recipe, ...updates } : recipe
          ),
        };
      }
      return book;
    }));
  };

  const deleteRecipeFromBook = (bookId: string, recipeId: string) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          recipes: book.recipes.filter(recipe => recipe.id !== recipeId),
        };
      }
      return book;
    }));
  };

  const addCategoryToBook = (bookId: string, category: string): boolean => {
    const trimmed = category.trim();
    const book = books.find(b => b.id === bookId);
    
    if (!book || !trimmed || book.categories.includes(trimmed)) {
      return false;
    }

    setBooks(books.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          categories: [...b.categories, trimmed],
        };
      }
      return b;
    }));
    return true;
  };

  const importBook = (bookData: Omit<RecipeBook, 'id' | 'createdAt'>) => {
    const newBook: RecipeBook = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setBooks([...books, newBook]);
    setActiveBookId(newBook.id);
  };

  return (
    <RecipeBooksContext.Provider
      value={{
        books,
        activeBookId,
        activeBook,
        setActiveBookId,
        addBook,
        deleteBook,
        updateBook,
        addRecipeToBook,
        updateRecipeInBook,
        deleteRecipeFromBook,
        addCategoryToBook,
        importBook,
      }}
    >
      {children}
    </RecipeBooksContext.Provider>
  );
}

export function useRecipeBooks() {
  const context = useContext(RecipeBooksContext);
  if (context === undefined) {
    throw new Error('useRecipeBooks must be used within a RecipeBooksProvider');
  }
  return context;
}
