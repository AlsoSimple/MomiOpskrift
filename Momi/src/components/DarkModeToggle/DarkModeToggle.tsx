import { useEffect, useState } from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import styles from './DarkModeToggle.module.scss';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.toggle} ${isDark ? styles.toggleDark : ''}`}
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className={`${styles.slider} ${isDark ? styles.sliderDark : ''}`}>
          {isDark ? <IoMoon className={styles.icon} /> : <IoSunny className={styles.icon} />}
        </div>
      </button>
      <span className={styles.label}>DARK MODE</span>
    </div>
  );
}
