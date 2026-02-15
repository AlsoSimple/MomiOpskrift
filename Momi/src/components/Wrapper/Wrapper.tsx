import { ReactNode } from 'react';
import Header from '../Header/Header';
import styles from './Wrapper.module.scss';

interface WrapperProps {
  children: ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
