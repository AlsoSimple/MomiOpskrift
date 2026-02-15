import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss';

export default function Footer() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/opret');
  };

  return (
    <footer className={styles.footer}>
      <button 
        className={styles.addButton}
        onClick={handleAddClick}
        aria-label="Add new recipe"
      >
        +
      </button>
    </footer>
  );
}
