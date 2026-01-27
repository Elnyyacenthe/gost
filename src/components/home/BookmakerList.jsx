import { useData } from '../../context/DataContext';
import BookmakerCard from './BookmakerCard';
import styles from './BookmakerList.module.css';

const BookmakerList = () => {
  const { bookmakers } = useData();

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            Nos <span className="gradient-text">bookmakers partenaires</span>
          </h2>
          <p className={styles.subtitle}>
            Découvrez les meilleurs sites de paris sportifs avec des bonus exclusifs
          </p>
        </div>

        <div className={styles.grid}>
          {bookmakers.map((bookmaker, index) => (
            <div
              key={bookmaker.id}
              className={styles.cardWrapper}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BookmakerCard bookmaker={bookmaker} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookmakerList;
