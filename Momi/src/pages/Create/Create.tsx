import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../context/CategoriesContext';
import { useRecipes } from '../../context/RecipesContext';
import styles from './Create.module.scss';

export default function Create() {
  const { id } = useParams<{ id: string }>();
  const [titel, setTitel] = useState('');
  const [link, setLink] = useState('');
  const [kategori, setKategori] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const { categories, addCategory } = useCategories();
  const { recipes, addRecipe, updateRecipe } = useRecipes();
  const navigate = useNavigate();
  
  const isEditing = !!id;

  // Load recipe data when editing
  useEffect(() => {
    if (isEditing) {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        setTitel(recipe.titel);
        setLink(recipe.link);
        setSelectedOption(recipe.kategori);
      }
    }
  }, [id, isEditing, recipes]);

  // Add new category when user types in "Ny kategori" field and presses Enter or loses focus
  const handleAddCategory = () => {
    if (addCategory(kategori)) {
      setSelectedOption(kategori.trim());
      setKategori('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titel.trim() && link.trim() && selectedOption) {
      if (isEditing && id) {
        updateRecipe(id, {
          titel: titel.trim(),
          link: link.trim(),
          kategori: selectedOption,
        });
      } else {
        addRecipe({
          titel: titel.trim(),
          link: link.trim(),
          kategori: selectedOption,
        });
      }
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <h1>{isEditing ? 'Rediger Opskrift' : 'Opret Opskrift'}</h1>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="titel">Titel</label>
          <input
            type="text"
            id="titel"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            placeholder="Indtast titel"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="link">Link</label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Indtast link"
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="dropdown">Kategori</label>
            <select
              id="dropdown"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Vælg</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="kategori">Ny kategori</label>
            <input
              type="text"
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              onBlur={handleAddCategory}
              onKeyPress={handleKeyPress}
              placeholder="Indtast navn"
            />
          </div>
        </div>
        
        <button type="submit" className={styles.submitButton}>
          {isEditing ? 'Gem Ændringer' : 'Gem Opskrift'}
        </button>
      </form>
    </div>
  );
}
