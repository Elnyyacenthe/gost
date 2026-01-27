import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, Copy, Check, Shield, Zap, Gift, Clock } from 'lucide-react';
import { useState } from 'react';
import { Navbar, Footer } from '../components/layout';
import { Button, Card } from '../components/ui';
import { useData } from '../context/DataContext';
import styles from './BookmakerDetail.module.css';

const BookmakerDetail = () => {
  const { id } = useParams();
  const { bookmakers, recordClick } = useData();
  const [copied, setCopied] = useState(false);

  const bookmaker = bookmakers.find(b => b.id === parseInt(id));

  if (!bookmaker) {
    return (
      <div className="page">
        <Navbar />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.notFound}>
              <h1>Bookmaker non trouvé</h1>
              <Link to="/bookmakers">
                <Button>Retour aux bookmakers</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookmaker.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    recordClick(bookmaker.id);
  };

  return (
    <div className="page">
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <Link to="/bookmakers" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Retour aux bookmakers</span>
          </Link>

          <div className={styles.content}>
            <div className={styles.left}>
              <Card className={styles.mainCard}>
                <div className={styles.cardContent}>
                  <div className={styles.header}>
                    <div className={styles.logoWrapper} style={{ background: bookmaker.gradient }}>
                      <span className={styles.logoText}>{bookmaker.name.charAt(0)}</span>
                    </div>
                    <div className={styles.headerInfo}>
                      <h1 className={styles.name}>{bookmaker.name}</h1>
                      <div className={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            fill={i < Math.floor(bookmaker.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                        <span>{bookmaker.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bonus}>
                    <Gift size={24} />
                    <div>
                      <span className={styles.bonusLabel}>Bonus de bienvenue</span>
                      <span className={styles.bonusValue}>{bookmaker.bonus}</span>
                    </div>
                  </div>

                  <p className={styles.description}>{bookmaker.description}</p>

                  <div className={styles.features}>
                    <h3>Caractéristiques</h3>
                    <ul>
                      {bookmaker.features.map((feature, index) => (
                        <li key={index}>
                          <Check size={18} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className={styles.infoCard}>
                <div className={styles.cardContent}>
                  <h3>Informations</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <Shield size={24} />
                      <div>
                        <span className={styles.infoLabel}>Licence</span>
                        <span className={styles.infoValue}>Curaçao</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <Zap size={24} />
                      <div>
                        <span className={styles.infoLabel}>Dépôt min.</span>
                        <span className={styles.infoValue}>500 FCFA</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <Clock size={24} />
                      <div>
                        <span className={styles.infoLabel}>Retrait</span>
                        <span className={styles.infoValue}>24-48h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className={styles.right}>
              <Card className={styles.stickyCard} gradient={bookmaker.gradient}>
                <div className={styles.cardContent}>
                  <div className={styles.promoCode}>
                    <span className={styles.codeLabel}>Code promo exclusif</span>
                    <div className={styles.codeBox}>
                      <span className={styles.code}>{bookmaker.promoCode}</span>
                      <button className={styles.copyButton} onClick={handleCopyCode}>
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                    {copied && <span className={styles.copiedMessage}>Code copié !</span>}
                  </div>

                  <a
                    href={bookmaker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleVisit}
                    className={styles.visitLink}
                  >
                    <Button
                      fullWidth
                      size="large"
                      icon={<ExternalLink size={20} />}
                      iconPosition="right"
                    >
                      Visiter {bookmaker.name}
                    </Button>
                  </a>

                  <p className={styles.disclaimer}>
                    18+ | Jeu responsable. T&C applicables.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookmakerDetail;
