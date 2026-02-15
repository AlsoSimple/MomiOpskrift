import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageContainer}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
