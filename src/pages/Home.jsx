import { Navbar, Footer } from '../components/layout';
import { Hero, BookmakerList, Features, CTA } from '../components/home';

const Home = () => {
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
