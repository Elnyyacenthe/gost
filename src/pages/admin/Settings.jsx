import { useState } from 'react';
import { Save, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import styles from './Settings.module.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'Administrateur',
    email: user?.email || 'admin@betpromo.com',
    phone: '+33 1 23 45 67 89'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newUsers: true,
    conversions: true,
    weeklyReport: false
  });

  const [site, setSite] = useState({
    siteName: 'BetPromo',
    siteUrl: 'https://betpromo.com',
    contactEmail: 'contact@betpromo.com'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'site', label: 'Site', icon: Globe },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Paramètres</h1>
            <p className={styles.subtitle}>Gérez les paramètres de votre compte et du site</p>
          </div>
        </div>

        <div className={styles.content}>
          <Card className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className={styles.mainCard}>
            <div className={styles.mainContent}>
              {activeTab === 'profile' && (
                <div className={styles.section}>
                  <h2>Informations du profil</h2>
                  <p className={styles.sectionDesc}>
                    Mettez à jour vos informations personnelles
                  </p>
                  <div className={styles.form}>
                    <Input
                      label="Nom complet"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                    <Input
                      label="Téléphone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className={styles.section}>
                  <h2>Préférences de notifications</h2>
                  <p className={styles.sectionDesc}>
                    Choisissez les notifications que vous souhaitez recevoir
                  </p>
                  <div className={styles.toggleList}>
                    <div className={styles.toggleItem}>
                      <div>
                        <span className={styles.toggleLabel}>Alertes par email</span>
                        <span className={styles.toggleDesc}>Recevoir des alertes importantes par email</span>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={notifications.emailAlerts}
                          onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <div className={styles.toggleItem}>
                      <div>
                        <span className={styles.toggleLabel}>Nouveaux utilisateurs</span>
                        <span className={styles.toggleDesc}>Notification lors de nouvelles inscriptions</span>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={notifications.newUsers}
                          onChange={(e) => setNotifications({...notifications, newUsers: e.target.checked})}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <div className={styles.toggleItem}>
                      <div>
                        <span className={styles.toggleLabel}>Conversions</span>
                        <span className={styles.toggleDesc}>Notification lors d'une conversion</span>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={notifications.conversions}
                          onChange={(e) => setNotifications({...notifications, conversions: e.target.checked})}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <div className={styles.toggleItem}>
                      <div>
                        <span className={styles.toggleLabel}>Rapport hebdomadaire</span>
                        <span className={styles.toggleDesc}>Recevoir un résumé chaque semaine</span>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'site' && (
                <div className={styles.section}>
                  <h2>Paramètres du site</h2>
                  <p className={styles.sectionDesc}>
                    Configurez les informations générales du site
                  </p>
                  <div className={styles.form}>
                    <Input
                      label="Nom du site"
                      value={site.siteName}
                      onChange={(e) => setSite({...site, siteName: e.target.value})}
                    />
                    <Input
                      label="URL du site"
                      value={site.siteUrl}
                      onChange={(e) => setSite({...site, siteUrl: e.target.value})}
                    />
                    <Input
                      label="Email de contact"
                      type="email"
                      value={site.contactEmail}
                      onChange={(e) => setSite({...site, contactEmail: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className={styles.section}>
                  <h2>Sécurité</h2>
                  <p className={styles.sectionDesc}>
                    Gérez la sécurité de votre compte
                  </p>
                  <div className={styles.form}>
                    <Input
                      label="Mot de passe actuel"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Input
                      label="Nouveau mot de passe"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Input
                      label="Confirmer le mot de passe"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                {saved && (
                  <span className={styles.savedMessage}>Modifications enregistrées !</span>
                )}
                <Button icon={<Save size={18} />} onClick={handleSave}>
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
