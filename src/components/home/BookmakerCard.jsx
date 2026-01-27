import { Star, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../ui';
import { useData } from '../../context/DataContext';
import styles from './BookmakerCard.module.css';

const BookmakerCard = ({ bookmaker }) => {
  const [copied, setCopied] = useState(false);
  const { recordClick } = useData();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookmaker.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    recordClick(bookmaker.id);
  };

  return (
    <Card hover gradient={bookmaker.gradient} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logoWrapper} style={{ background: bookmaker.gradient }}>
            <span className={styles.logoText}>{bookmaker.name.charAt(0)}</span>
          </div>
          <div className={styles.info}>
            <h3 className={styles.name}>{bookmaker.name}</h3>
            <div className={styles.rating}>
              <Star size={14} fill="currentColor" />
              <span>{bookmaker.rating}</span>
            </div>
          </div>
        </div>

        <div className={styles.bonus}>
          <span className={styles.bonusLabel}>Bonus</span>
          <span className={styles.bonusValue}>{bookmaker.bonus}</span>
        </div>

        <p className={styles.description}>{bookmaker.description}</p>

        <div className={styles.features}>
          {bookmaker.features.slice(0, 3).map((feature, index) => (
            <span key={index} className={styles.feature}>{feature}</span>
          ))}
        </div>

        <div className={styles.promoCode}>
          <div className={styles.codeWrapper}>
            <span className={styles.codeLabel}>Code promo:</span>
            <span className={styles.code}>{bookmaker.promoCode}</span>
          </div>
          <button className={styles.copyButton} onClick={handleCopyCode}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className={styles.actions}>
          <a
            href={bookmaker.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleVisit}
            className={styles.visitLink}
          >
            <Button fullWidth icon={<ExternalLink size={18} />} iconPosition="right">
              Visiter le site
            </Button>
          </a>
          <Link to={`/bookmaker/${bookmaker.id}`} className={styles.detailLink}>
            <Button variant="secondary" fullWidth>
              Voir les détails
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BookmakerCard;
