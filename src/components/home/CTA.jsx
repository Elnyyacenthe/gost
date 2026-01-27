import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '../ui';
import styles from './CTA.module.css';

const CTA = () => {
  return (
    <section className={styles.section}>
      <div className={styles.background}>
        <div className={styles.gradient}></div>
      </div>
      <div className={`container ${styles.container}`}>
        <div className={styles.icon}>
          <Trophy size={48} />
        </div>
        <h2 className={styles.title}>
          Prêt à gagner gros ?
        </h2>
        <p className={styles.subtitle}>
          Inscrivez-vous maintenant sur l'un de nos partenaires et profitez de bonus exclusifs
          jusqu'à 200 000 FCFA sur votre premier dépôt !
        </p>
        <div className={styles.buttons}>
          <Link to="/bookmakers">
            <Button size="large" icon={<ArrowRight size={20} />} iconPosition="right">
              Commencer maintenant
            </Button>
          </Link>
          <Link to="/bonus">
            <Button variant="outline" size="large">
              Voir tous les bonus
            </Button>
          </Link>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>50K+</span>
            <span className={styles.statLabel}>Utilisateurs</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>4</span>
            <span className={styles.statLabel}>Bookmakers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Fiable</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
