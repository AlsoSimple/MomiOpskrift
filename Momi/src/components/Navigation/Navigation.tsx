import { NavLink } from 'react-router-dom';
import { IoRestaurant, IoHeart, IoGrid, IoShareSocial } from 'react-icons/io5';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import styles from './Navigation.module.scss';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      
      {/* Slide-in Menu */}
      <nav className={`${styles.navigation} ${isOpen ? styles.navigationOpen : ''}`}>
        <div className={styles.header}>
          <h2>Menu</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        
        <ul className={styles.navList}>
          <li>
            <NavLink 
              to="/" 
              onClick={onClose}
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <IoRestaurant className={styles.icon} />
              <span>Opskrifter</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/favoritter" 
              onClick={onClose}
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <IoHeart className={styles.icon} />
              <span>Favoritter</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/kategorier" 
              onClick={onClose}
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <IoGrid className={styles.icon} />
              <span>Kategorier</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/del" 
              onClick={onClose}
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <IoShareSocial className={styles.icon} />
              <span>Del Opskrifter</span>
            </NavLink>
          </li>
        </ul>
        
        <div className={styles.darkModeSection}>
          <DarkModeToggle />
        </div>
      </nav>
    </>
  );
}
