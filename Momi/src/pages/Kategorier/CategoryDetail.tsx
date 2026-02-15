import { useParams, Link } from 'react-router-dom';
import { useRecipes } from '../../context/RecipesContext';
import styles from './CategoryDetail.module.scss';

export default function CategoryDetail() {
  const { category } = useParams<{ category: string }>();
  const { recipes } = useRecipes();
  
  const decodedCategory = decodeURIComponent(category || '');
  const categoryRecipes = recipes
    .filter(recipe => recipe.kategori === decodedCategory)
    .sort((a, b) => a.titel.toLowerCase().localeCompare(b.titel.toLowerCase()));

  // Group recipes by first letter
  const groupedRecipes = categoryRecipes.reduce((acc, recipe) => {
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
      <div className={styles.header}>
        <Link to="/kategorier" className={styles.backButton}>
          ← Tilbage
        </Link>
        <h1>{decodedCategory}</h1>
      </div>
      
      {categoryRecipes.length === 0 ? (
        <p className={styles.emptyMessage}>Ingen opskrifter i denne kategori.</p>
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
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
