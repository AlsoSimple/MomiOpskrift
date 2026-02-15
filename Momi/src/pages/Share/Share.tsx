import { useState } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { useRecipeBooks } from '../../context/RecipeBooksContext';
import { QRCodeSVG } from 'qrcode.react';
import LZString from 'lz-string';
import styles from './Share.module.scss';

export default function Share() {
  const { activeBook } = useRecipeBooks();
  const [shareLink, setShareLink] = useState('');
  const [shareMethod, setShareMethod] = useState<'qr' | 'link' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = (method: 'qr' | 'link') => {
    if (!activeBook) return;
    
    setIsGenerating(true);
    setShareMethod(method);
    try {
      const data = {
        name: activeBook.name,
        color: activeBook.color,
        recipes: activeBook.recipes,
        categories: activeBook.categories,
        sharedAt: Date.now(),
      };

      // Compress and encode data for URL
      const jsonString = JSON.stringify(data);
      const compressed = LZString.compressToEncodedURIComponent(jsonString);
      
      const link = `${window.location.origin}/importer/${compressed}`;
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
        Send din opskriftsbog "{activeBook.name}" til familie og venner.
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
        <div className={styles.buttonGroup}>
          <button 
            className={styles.methodButton}
            onClick={() => generateShareLink('qr')}
            disabled={isGenerating || activeBook.recipes.length === 0}
          >
            {isGenerating && shareMethod === 'qr' ? 'Laver QR...' : 'QR Kode'}
          </button>
          <button 
            className={styles.methodButton}
            onClick={() => generateShareLink('link')}
            disabled={isGenerating || activeBook.recipes.length === 0}
          >
            {isGenerating && shareMethod === 'link' ? 'Laver link...' : 'Del Link'}
          </button>
        </div>
      ) : shareMethod === 'qr' ? (
        <div className={styles.qrSection}>
          <p className={styles.success}><IoCheckmark /> Klar!</p>
          <div className={styles.qrBox}>
            <QRCodeSVG value={shareLink} size={256} level="M" />
          </div>
          <p className={styles.hint}>
            Scan QR-koden med telefonen
          </p>
          <button 
            className={styles.backButton}
            onClick={() => { setShareLink(''); setShareMethod(null); }}
          >
            Tilbage
          </button>
        </div>
      ) : (
        <div className={styles.linkSection}>
          <p className={styles.success}><IoCheckmark /> Klar!</p>
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
              {copied ? <><IoCheckmark /> Kopieret</> : 'Kopiér'}
            </button>
          </div>
          <p className={styles.hint}>
            Send linket via SMS, WhatsApp eller e-mail
          </p>
          <button 
            className={styles.backButton}
            onClick={() => { setShareLink(''); setShareMethod(null); }}
          >
            Tilbage
          </button>
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
