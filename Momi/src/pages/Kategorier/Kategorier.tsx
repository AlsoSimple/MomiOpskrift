import { Link } from 'react-router-dom';
import { useCategories } from '../../context/CategoriesContext';
import { useRecipes } from '../../context/RecipesContext';
import styles from './Kategorier.module.scss';

export default function Kategorier() {
  const { categories } = useCategories();
  const { recipes } = useRecipes();
  
  const sortedCategories = [...categories].sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Get recipe count for each category
  const getCategoryCount = (category: string) => {
    return recipes.filter(recipe => recipe.kategori === category).length;
  };

  // Group categories by first letter
  const groupedCategories = sortedCategories.reduce((acc, category) => {
    const firstLetter = category.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {} as Record<string, string[]>);

  // Get sorted letters
  const letters = Object.keys(groupedCategories).sort();

  return (
    <div className={styles.container}>
      <h1>Kategorier</h1>
      
      {sortedCategories.length === 0 ? (
        <p className={styles.emptyMessage}>Ingen kategorier endnu. Opret en opskrift for at tilføje kategorier.</p>
      ) : (
        <div className={styles.categoryList}>
          {letters.map((letter) => (
            <div key={letter} className={styles.letterGroup}>
              <div className={styles.letterHeader}>{letter}</div>
              <div className={styles.pillContainer}>
                {groupedCategories[letter].map((category) => (
                  <Link 
                    key={category}
                    to={`/kategorier/${encodeURIComponent(category)}`}
                    className={styles.categoryPill}
                  >
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryCount}>{getCategoryCount(category)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
