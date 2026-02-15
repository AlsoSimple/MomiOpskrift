import { useNavigate } from 'react-router-dom';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { useRecipes } from '../../context/RecipesContext';
import styles from './Opskrifter.module.scss';

export default function Opskrifter() {
  const { recipes, deleteRecipe } = useRecipes();
  const navigate = useNavigate();
  
  const sortedRecipes = [...recipes].sort((a, b) => 
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

  return (
    <div className={styles.container}>
      <h1>Opskrifter</h1>
      
      {sortedRecipes.length === 0 ? (
        <p className={styles.emptyMessage}>Ingen opskrifter endnu. Tryk på + for at tilføje en.</p>
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
