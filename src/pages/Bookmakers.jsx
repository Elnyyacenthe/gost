import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { BookmakerCard } from '../components/home';
import { Input } from '../components/ui';
import { useData } from '../context/DataContext';
import styles from './Bookmakers.module.css';

const Bookmakers = () => {
  const { bookmakers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const filteredBookmakers = bookmakers
    .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="page">
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>
              Tous nos <span className="gradient-text">bookmakers</span>
            </h1>
            <p className={styles.subtitle}>
              Comparez les meilleurs sites de paris sportifs et trouvez celui qui vous convient
            </p>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchWrapper}>
              <Input
                icon={<Search size={20} />}
                placeholder="Rechercher un bookmaker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.sortWrapper}>
              <Filter size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.select}
              >
                <option value="rating">Note</option>
                <option value="name">Nom</option>
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            {filteredBookmakers.map((bookmaker, index) => (
              <div
                key={bookmaker.id}
                className={styles.cardWrapper}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookmakerCard bookmaker={bookmaker} />
              </div>
            ))}
          </div>

          {filteredBookmakers.length === 0 && (
            <div className={styles.empty}>
              <p>Aucun bookmaker trouvé</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookmakers;
