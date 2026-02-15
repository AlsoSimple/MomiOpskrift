import { useNavigate } from 'react-router-dom';
import { IoPencil, IoTrash, IoHeart } from 'react-icons/io5';
import { useRecipes } from '../../context/RecipesContext';
import styles from './Favoritter.module.scss';

export default function Favoritter() {
  const { recipes, deleteRecipe, toggleFavorite } = useRecipes();
  const navigate = useNavigate();
  
  // Filter only favorited recipes
  const favoritedRecipes = recipes.filter(recipe => recipe.isFavorite);
  
  const sortedRecipes = [...favoritedRecipes].sort((a, b) => 
    a.titel.toLowerCase().localeCompare(b.titel.toLowerCase())
  );

  // Group recipes by first letter
  const groupedRecipes = sortedRecipes.reduce((acc, recipe) => {
    const firstLetter = recipe.titel.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(recipe);
    return acc;
  }, {} as Record<string, typeof recipes>);

  // Get sorted letters
  const letters = Object.keys(groupedRecipes).sort();

  const handleDelete = (id: string, titel: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Slet "${titel}"?`)) {
      deleteRecipe(id);
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/opret/${id}`);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className={styles.container}>
      <h1>Favoritter</h1>
      
      {sortedRecipes.length === 0 ? (
        <p className={styles.emptyMessage}>Ingen favoritter endnu. Tryk på hjertet ved en opskrift for at tilføje den.</p>
      ) : (
        <div className={styles.recipeList}>
          {letters.map((letter) => (
            <div key={letter} className={styles.letterGroup}>
              <div className={styles.letterHeader}>{letter}</div>
              {groupedRecipes[letter].map((recipe) => (
                <div key={recipe.id} className={styles.recipeCard}>
                  <div className={styles.recipeInfo}>
                    <a 
                      href={recipe.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.recipeLink}
                    >
                      <h2>{recipe.titel}</h2>
                      <span className={styles.category}>{recipe.kategori}</span>
                    </a>
                  </div>
                  <div className={styles.recipeActions}>
                    <button 
                      className={styles.favoriteButtonActive}
                      onClick={(e) => handleToggleFavorite(recipe.id, e)}
                      aria-label="Fjern fra favoritter"
                    >
                      <IoHeart />
                    </button>
                    <button 
                      className={styles.editButton}
                      onClick={(e) => handleEdit(recipe.id, e)}
                      aria-label="Rediger opskrift"
                    >
                      <IoPencil />
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(recipe.id, recipe.titel, e)}
                      aria-label="Slet opskrift"
                    >
                      <IoTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
