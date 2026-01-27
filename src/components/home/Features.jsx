import { Shield, Zap, Gift, HeadphonesIcon, TrendingUp, Clock } from 'lucide-react';
import styles from './Features.module.css';

const features = [
  {
    icon: Shield,
    title: 'Sites vérifiés',
    description: 'Tous nos partenaires sont des sites légaux et sécurisés pour vos paris.'
  },
  {
    icon: Gift,
    title: 'Bonus exclusifs',
    description: 'Profitez de codes promo uniques non disponibles ailleurs.'
  },
  {
    icon: Zap,
    title: 'Inscription rapide',
    description: 'Créez votre compte en quelques minutes et commencez à parier.'
  },
  {
    icon: TrendingUp,
    title: 'Meilleures cotes',
    description: 'Nos partenaires offrent les cotes les plus compétitives du marché.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Support 24/7',
    description: 'Une assistance disponible à tout moment pour vous accompagner.'
  },
  {
    icon: Clock,
    title: 'Retraits rapides',
    description: 'Récupérez vos gains rapidement avec des méthodes de paiement variées.'
  }
];

const Features = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            Pourquoi nous <span className="gradient-text">choisir</span> ?
          </h2>
          <p className={styles.subtitle}>
            Des avantages exclusifs pour maximiser votre expérience de paris
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={28} />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
