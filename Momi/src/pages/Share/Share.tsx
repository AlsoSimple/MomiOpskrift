import { useState } from 'react';
import { useRecipeBooks } from '../../context/RecipeBooksContext';
import styles from './Share.module.scss';

export default function Share() {
  const { activeBook } = useRecipeBooks();
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    if (!activeBook) return;
    
    setIsGenerating(true);
    try {
      const data = {
        name: activeBook.name,
        color: activeBook.color,
        recipes: activeBook.recipes,
        categories: activeBook.categories,
        sharedAt: Date.now(),
      };

      // Encode data as base64 for URL
      const jsonString = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(jsonString));
      
      const link = `${window.location.origin}/importer/${encoded}`;
      setShareLink(link);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Kunne ikke oprette delingslink. Prøv igen.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeBook) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>Ingen aktiv opskriftsbog valgt.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Del Opskriftsbog</h1>
      <p className={styles.description}>
        Del din opskriftsbog "{activeBook.name}" med familie og venner via et link.
      </p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{activeBook.recipes.length}</span>
          <span className={styles.statLabel}>Opskrifter</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{activeBook.categories.length}</span>
          <span className={styles.statLabel}>Kategorier</span>
        </div>
      </div>

      {!shareLink ? (
        <button 
          className={styles.generateButton}
          onClick={generateShareLink}
          disabled={isGenerating || activeBook.recipes.length === 0}
        >
          {isGenerating ? 'Opretter link...' : 'Opret Delingslink'}
        </button>
      ) : (
        <div className={styles.linkSection}>
          <p className={styles.success}>✓ Link oprettet!</p>
          <div className={styles.linkBox}>
            <input 
              type="text" 
              value={shareLink} 
              readOnly 
              className={styles.linkInput}
            />
            <button 
              className={styles.copyButton}
              onClick={copyToClipboard}
            >
              {copied ? '✓ Kopieret' : 'Kopiér'}
            </button>
          </div>
          <p className={styles.hint}>
            Send dette link til andre via SMS, WhatsApp eller e-mail
          </p>
        </div>
      )}

      {activeBook.recipes.length === 0 && (
        <p className={styles.emptyMessage}>
          Du har ingen opskrifter at dele endnu.
        </p>
      )}
    </div>
  );
}
