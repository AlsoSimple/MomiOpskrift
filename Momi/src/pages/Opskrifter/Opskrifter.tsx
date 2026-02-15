import { useRecipes } from '../../context/RecipesContext';
import styles from './Opskrifter.module.scss';

export default function Opskrifter() {
  const { recipes } = useRecipes();
  
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
                <a 
                  key={recipe.id} 
                  href={recipe.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.recipeCard}
                >
                  <h2>{recipe.titel}</h2>
                  <span className={styles.category}>{recipe.kategori}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
