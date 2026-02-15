import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useRecipeBooks } from './RecipeBooksContext';

interface CategoriesContextType {
  categories: string[];
  setCategories: (value: string[] | ((val: string[]) => string[])) => void;
  addCategory: (category: string) => boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { activeBook, activeBookId, updateBook, addCategoryToBook } = useRecipeBooks();

  const categories = activeBook?.categories || [];

  const setCategories = (value: string[] | ((val: string[]) => string[])) => {
    if (!activeBook) return;
    
    const newCategories = typeof value === 'function' ? value(categories) : value;
    updateBook(activeBookId, { categories: newCategories });
  };

  const addCategory = (category: string): boolean => {
    return addCategoryToBook(activeBookId, category);
  };

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
