import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeBooks } from '../../context/RecipeBooksContext';
import type { Recipe } from '../../context/RecipesContext';
import LZString from 'lz-string';
import styles from './Import.module.scss';

interface SharedBookData {
  name: string;
  color: string;
  recipes: Recipe[];
  categories: string[];
  sharedAt: number;
}

export default function Import() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { importBook } = useRecipeBooks();
  
  const [sharedData, setSharedData] = useState<SharedBookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const decodeSharedData = () => {
      try {
        if (!shareId) throw new Error('Intet link');
        
        // Decompress data from URL
        const decompressed = LZString.decompressFromEncodedURIComponent(shareId);
        if (!decompressed) throw new Error('Kunne ikke dekomprimere data');
        const data: SharedBookData = JSON.parse(decompressed);
        
        // Validate data structure
        if (!data.name || !Array.isArray(data.recipes) || !Array.isArray(data.categories)) {
          throw new Error('Ugyldigt data');
        }
        
        setSharedData(data);
      } catch (err) {
        console.error('Decode error:', err);
        setError('Kunne ikke læse opskriftsbog. Linket er muligvis beskadiget.');
      } finally {
        setIsLoading(false);
      }
    };

    if (shareId) {
      decodeSharedData();
    } else {
      setError('Intet delingslink fundet.');
      setIsLoading(false);
    }
  }, [shareId]);

  const handleImport = () => {
    if (!sharedData) return;
    
    setIsImporting(true);

    // Import as new book
    importBook({
      name: sharedData.name,
      color: sharedData.color,
      recipes: sharedData.recipes,
      categories: sharedData.categories,
    });

    // Navigate and show success
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Åbner delte opskrifter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h1>❌ Fejl</h1>
          <p>{error}</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/')}
          >
            Gå til Forsiden
          </button>
        </div>
      </div>
    );
  }

  if (!sharedData) return null;

  return (
    <div className={styles.container}>
      <div className={styles.importBox}>
        <h1>📚 Modtag Opskrifter</h1>
        
        <div className={styles.bookPreview}>
          <div 
            className={styles.bookColor} 
            style={{ backgroundColor: sharedData.color }}
          />
          <h2 className={styles.bookName}>{sharedData.name}</h2>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewStat}>
            <span className={styles.number}>{sharedData.recipes.length}</span>
            <span className={styles.label}>Opskrifter</span>
          </div>
          <div className={styles.previewStat}>
            <span className={styles.number}>{sharedData.categories.length}</span>
            <span className={styles.label}>Kategorier</span>
          </div>
        </div>

        {sharedData.recipes.length > 0 && (
          <div className={styles.recipeList}>
            <h3>Opskrifter i denne bog:</h3>
            {sharedData.recipes.slice(0, 10).map((recipe, idx) => (
              <div key={idx} className={styles.recipeItem}>
                <span className={styles.recipeTitle}>{recipe.titel}</span>
                <span className={styles.recipeCategory}>{recipe.kategori}</span>
              </div>
            ))}
            {sharedData.recipes.length > 10 && (
              <p className={styles.moreText}>
                ... og {sharedData.recipes.length - 10} mere
              </p>
            )}
          </div>
        )}

        <button
          className={styles.importButton}
          onClick={handleImport}
          disabled={isImporting}
        >
          {isImporting ? '✓ Gemmer...' : 'Gem i Mine Bøger'}
        </button>

        <button
          className={styles.cancelButton}
          onClick={() => navigate('/')}
        >
          Annuller
        </button>

        <p className={styles.note}>
          Dette tilføjer en ny opskriftsbog. Dine andre bøger forbliver som de er.
        </p>
      </div>
    </div>
  );
}
