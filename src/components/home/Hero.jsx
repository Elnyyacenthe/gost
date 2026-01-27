import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { Button } from '../ui';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
        <div className={styles.grid}></div>
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <Zap size={16} />
            <span>Les meilleurs codes promo 2024</span>
          </div>

          <h1 className={styles.title}>
            Gagnez plus avec les
            <span className="gradient-text"> meilleurs bookmakers</span>
          </h1>

          <p className={styles.subtitle}>
            Découvrez les codes promo exclusifs pour Mosbet, 1xbet, Melbet et 888starz.
            Maximisez vos gains avec nos bonus vérifiés et nos conseils d'experts.
          </p>

          <div className={styles.buttons}>
            <Link to="/bookmakers">
              <Button size="large" icon={<ArrowRight size={20} />} iconPosition="right">
                Voir les offres
              </Button>
            </Link>
            <Link to="/bonus">
              <Button variant="secondary" size="large">
                Codes bonus
              </Button>
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <Star className={styles.featureIcon} />
              <span>Bonus vérifiés</span>
            </div>
            <div className={styles.feature}>
              <Shield className={styles.featureIcon} />
              <span>Sites sécurisés</span>
            </div>
            <div className={styles.feature}>
              <Zap className={styles.featureIcon} />
              <span>Inscription rapide</span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.cards}>
            <div className={`${styles.floatingCard} ${styles.card1}`}>
              <span className={styles.cardLabel}>Mosbet</span>
              <span className={styles.cardBonus}>100% Bonus</span>
              <span className={styles.cardCode}>TRY</span>
            </div>
            <div className={`${styles.floatingCard} ${styles.card2}`}>
              <span className={styles.cardLabel}>1xbet</span>
              <span className={styles.cardBonus}>200% Bonus</span>
              <span className={styles.cardCode}>M30</span>
            </div>
            <div className={`${styles.floatingCard} ${styles.card3}`}>
              <span className={styles.cardLabel}>Melbet</span>
              <span className={styles.cardBonus}>100% Bonus</span>
              <span className={styles.cardCode}>M30</span>
            </div>
            <div className={`${styles.floatingCard} ${styles.card4}`}>
              <span className={styles.cardLabel}>888starz</span>
              <span className={styles.cardBonus}>150% Bonus</span>
              <span className={styles.cardCode}>M30</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
