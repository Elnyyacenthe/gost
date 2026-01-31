import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useData();

  const siteSettings = settings?.site || {};
  const socialLinks = siteSettings.socialLinks || {};
  const footerBookmakers = siteSettings.footerBookmakers || [
    { name: 'Mosbet', url: '/bookmaker/1' },
    { name: '1xbet', url: '/bookmaker/2' },
    { name: 'Melbet', url: '/bookmaker/3' },
    { name: '888starz', url: '/bookmaker/4' }
  ];

  const socialItems = [
    { url: socialLinks.facebook, icon: Facebook },
    { url: socialLinks.twitter, icon: Twitter },
    { url: socialLinks.instagram, icon: Instagram },
    { url: socialLinks.youtube, icon: Youtube },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <Zap className={styles.logoIcon} />
              <span className={styles.logoText}>{siteSettings.siteName || 'BetPromo'}</span>
            </Link>
            <p className={styles.description}>
              Votre guide ultime pour les meilleurs sites de paris sportifs.
              Trouvez les bonus les plus avantageux et commencez à parier en toute confiance.
            </p>
            <div className={styles.social}>
              {socialItems.map(({ url, icon: Icon }, index) => (
                url ? (
                  <a key={index} href={url} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                    <Icon size={20} />
                  </a>
                ) : (
                  <span key={index} className={`${styles.socialLink} ${styles.socialDisabled}`}>
                    <Icon size={20} />
                  </span>
                )
              ))}
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
              {footerBookmakers.map((bm, index) => (
                <li key={index}>
                  {bm.url.startsWith('http') ? (
                    <a href={bm.url} target="_blank" rel="noopener noreferrer">{bm.name}</a>
                  ) : (
                    <Link to={bm.url}>{bm.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contact}>
            <h4 className={styles.title}>Contact</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Mail size={18} />
                <span>{siteSettings.contactEmail || 'contact@betpromo.com'}</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} />
                <span>{siteSettings.contactPhone || '+33 1 23 45 67 89'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} {siteSettings.siteName || 'BetPromo'}. Tous droits réservés.
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
