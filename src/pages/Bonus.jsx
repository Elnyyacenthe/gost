import { useState } from 'react';
import { Gift, Copy, Check, ExternalLink } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { Button, Card } from '../components/ui';
import { useData } from '../context/DataContext';
import styles from './Bonus.module.css';

const Bonus = () => {
  const { bookmakers, recordClick } = useData();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page">
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <Gift size={40} />
            </div>
            <h1 className={styles.title}>
              Codes <span className="gradient-text">Bonus</span> Exclusifs
            </h1>
            <p className={styles.subtitle}>
              Utilisez nos codes promo exclusifs pour maximiser vos bonus de bienvenue
            </p>
          </div>

          <div className={styles.grid}>
            {bookmakers.map((bookmaker, index) => (
              <Card
                key={bookmaker.id}
                hover
                gradient={bookmaker.gradient}
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.logo} style={{ background: bookmaker.gradient }}>
                      {bookmaker.name.charAt(0)}
                    </div>
                    <div className={styles.cardInfo}>
                      <h3>{bookmaker.name}</h3>
                      <span className={styles.bonus}>{bookmaker.bonus}</span>
                    </div>
                  </div>

                  <div className={styles.codeSection}>
                    <span className={styles.codeLabel}>Code promo</span>
                    <div className={styles.codeBox}>
                      <span className={styles.code}>{bookmaker.promoCode}</span>
                      <button
                        className={styles.copyBtn}
                        onClick={() => handleCopyCode(bookmaker.id, bookmaker.promoCode)}
                      >
                        {copiedId === bookmaker.id ? (
                          <Check size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                    {copiedId === bookmaker.id && (
                      <span className={styles.copied}>Copié !</span>
                    )}
                  </div>

                  <div className={styles.features}>
                    {bookmaker.features.slice(0, 2).map((feature, i) => (
                      <span key={i} className={styles.feature}>{feature}</span>
                    ))}
                  </div>

                  <a
                    href={bookmaker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordClick(bookmaker.id)}
                    className={styles.visitBtn}
                  >
                    <Button fullWidth icon={<ExternalLink size={18} />} iconPosition="right">
                      Utiliser le code
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>

          <div className={styles.instructions}>
            <h2>Comment utiliser les codes promo ?</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Copiez le code</h4>
                  <p>Cliquez sur le bouton copier à côté du code promo souhaité</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Inscrivez-vous</h4>
                  <p>Créez un compte sur le site du bookmaker en cliquant sur "Utiliser le code"</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Collez le code</h4>
                  <p>Entrez le code promo lors de votre inscription ou premier dépôt</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h4>Profitez du bonus</h4>
                  <p>Votre bonus sera automatiquement crédité sur votre compte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bonus;
