import { useState } from 'react';
import { IoBookSharp } from 'react-icons/io5';
import styles from './Onboarding.module.scss';

interface OnboardingProps {
  onComplete: (bookName: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [bookName, setBookName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookName.trim()) {
      onComplete(bookName.trim());
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <IoBookSharp />
        </div>
        
        <h1>Velkommen til Momi</h1>
        <p className={styles.description}>
          Lad os komme i gang! Hvad vil du kalde din første opskriftsbog?
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            placeholder="f.eks. Mine Favoritopskrifter"
            className={styles.input}
            autoFocus
          />
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!bookName.trim()}
          >
            Kom i gang
          </button>
        </form>

        <p className={styles.hint}>
          Du kan altid oprette flere opskriftsbøger senere
        </p>
      </div>
    </div>
  );
}
