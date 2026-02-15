import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useRecipeBooks } from './RecipeBooksContext';

export interface Recipe {
  id: string;
  titel: string;
  link: string;
  kategori: string;
  createdAt: number;
  isFavorite?: boolean;
}

interface RecipesContextType {
  recipes: Recipe[];
  setRecipes: (value: Recipe[] | ((val: Recipe[]) => Recipe[])) => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const { activeBook, activeBookId, updateBook, addRecipeToBook, updateRecipeInBook, deleteRecipeFromBook } = useRecipeBooks();

  const recipes = activeBook?.recipes || [];

  const setRecipes = (value: Recipe[] | ((val: Recipe[]) => Recipe[])) => {
    if (!activeBook) return;
    
    const newRecipes = typeof value === 'function' ? value(recipes) : value;
    updateBook(activeBookId, { recipes: newRecipes });
  };

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    addRecipeToBook(activeBookId, recipe);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    updateRecipeInBook(activeBookId, id, updates);
  };

  const deleteRecipe = (id: string) => {
    deleteRecipeFromBook(activeBookId, id);
  };

  const toggleFavorite = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      updateRecipeInBook(activeBookId, id, { isFavorite: !recipe.isFavorite });
    }
  };

  return (
    <RecipesContext.Provider value={{ recipes, setRecipes, addRecipe, updateRecipe, deleteRecipe, toggleFavorite }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
}
