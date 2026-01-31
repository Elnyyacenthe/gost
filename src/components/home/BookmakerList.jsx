import { useData } from '../../context/DataContext';
import BookmakerCard from './BookmakerCard';
import styles from './BookmakerList.module.css';

const BookmakerList = () => {
  const { bookmakers, isLoading } = useData();

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.header}>
            <h2 className={styles.title}>Chargement...</h2>
          </div>
        </div>
      </section>
    );
  }

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

        {bookmakers.length > 0 ? (
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
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Aucun bookmaker disponible pour le moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default BookmakerList;
