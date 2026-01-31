import { useEffect } from 'react';
import { Navbar, Footer } from '../components/layout';
import { Hero, BookmakerList, Features, CTA } from '../components/home';
import { useData } from '../context/DataContext';

const Home = () => {
  const { recordVisit } = useData();

  // Enregistrer la visite au chargement de la page
  useEffect(() => {
    const visited = sessionStorage.getItem('betpromo_visited');
    if (!visited) {
      recordVisit();
      sessionStorage.setItem('betpromo_visited', 'true');
    }
  }, [recordVisit]);

  return (
    <div className="page">
      <Navbar />
      <main>
        <Hero />
        <BookmakerList />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
