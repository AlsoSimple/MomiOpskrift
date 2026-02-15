import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import Navigation from '../Navigation/Navigation';
import BookSwitcher from '../BookSwitcher/BookSwitcher';
import styles from './Header.module.scss';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreatePage = location.pathname === '/opret';
  const isSharePage = location.pathname === '/del';
  const showBackButton = isCreatePage || isSharePage || location.pathname.startsWith('/opret/');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <header className={styles.header}>
        {showBackButton ? (
          <button 
            className={styles.backButton}
            onClick={handleBack}
            aria-label="Go back"
          >
            <IoArrowBack />
          </button>
        ) : (
          <button 
            className={styles.burgerButton}
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>
        )}
        
        <h1 className={styles.title}>Momi</h1>
        
        <BookSwitcher />
      </header>
      
      <Navigation isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
