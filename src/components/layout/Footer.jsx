import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <Zap className={styles.logoIcon} />
              <span className={styles.logoText}>BetPromo</span>
            </Link>
            <p className={styles.description}>
              Votre guide ultime pour les meilleurs sites de paris sportifs.
              Trouvez les bonus les plus avantageux et commencez à parier en toute confiance.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}><Facebook size={20} /></a>
              <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
              <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
              <a href="#" className={styles.socialLink}><Youtube size={20} /></a>
            </div>
          </div>

          <div className={styles.links}>
            <h4 className={styles.title}>Navigation</h4>
            <ul className={styles.list}>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/bookmakers">Bookmakers</Link></li>
              <li><Link to="/bonus">Bonus</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4 className={styles.title}>Bookmakers</h4>
            <ul className={styles.list}>
              <li><Link to="/bookmaker/1">Mosbet</Link></li>
              <li><Link to="/bookmaker/2">1xbet</Link></li>
              <li><Link to="/bookmaker/3">Melbet</Link></li>
              <li><Link to="/bookmaker/4">888starz</Link></li>
            </ul>
          </div>

          <div className={styles.contact}>
            <h4 className={styles.title}>Contact</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Mail size={18} />
                <span>contact@betpromo.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} />
                <span>+33 1 23 45 67 89</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} BetPromo. Tous droits réservés.
          </p>
          <div className={styles.legal}>
            <Link to="/privacy">Politique de confidentialité</Link>
            <Link to="/terms">Conditions d'utilisation</Link>
          </div>
        </div>

        <div className={styles.disclaimer}>
          <p>
            18+ | Jeu responsable. Les paris comportent des risques.
            Ne pariez que ce que vous pouvez vous permettre de perdre.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
