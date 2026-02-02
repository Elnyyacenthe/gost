import { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Globe, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import pb from '../../services/pocketbase';
import styles from './Settings.module.css';

const Settings = () => {
  const { user, login, userRole } = useAuth();
  const { settings, updateSettings } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: settings?.profile?.name || user?.name || 'Administrateur',
    email: settings?.profile?.email || user?.email || 'admin@betpromo.com',
    phone: settings?.profile?.phone || ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: settings?.notifications?.emailAlerts ?? true,
    newUsers: settings?.notifications?.newUsers ?? true,
    conversions: settings?.notifications?.conversions ?? true,
    weeklyReport: settings?.notifications?.weeklyReport ?? false
  });

  const [site, setSite] = useState({
    siteName: settings?.site?.siteName || 'BetPromo',
    siteUrl: settings?.site?.siteUrl || '',
    contactEmail: settings?.site?.contactEmail || 'contact@betpromo.com',
    contactPhone: settings?.site?.contactPhone || '+33 1 23 45 67 89',
    contactAddress: settings?.site?.contactAddress || 'Paris, France',
    contactHours: settings?.site?.contactHours || 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé',
    socialLinks: settings?.site?.socialLinks || { facebook: '', twitter: '', instagram: '', youtube: '' },
    footerBookmakers: settings?.site?.footerBookmakers || [
      { name: 'Mosbet', url: '/bookmaker/1' },
      { name: '1xbet', url: '/bookmaker/2' },
      { name: 'Melbet', url: '/bookmaker/3' },
      { name: '888starz', url: '/bookmaker/4' }
    ]
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Synchroniser avec les settings du contexte
  useEffect(() => {
    if (settings) {
      if (settings.profile) setProfile(settings.profile);
      if (settings.notifications) setNotifications(settings.notifications);
      if (settings.site) setSite(prev => ({ ...prev, ...settings.site }));
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);

    await updateSettings({
      profile,
      notifications,
      site
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwords.current) {
      setPasswordError('Veuillez entrer votre mot de passe actuel');
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setPasswordSaving(true);

    try {
      // Détecter la collection d'auth de l'utilisateur
      const authCollection = user?.collectionName === '_superusers' || !user?.role
        ? '_superusers'
        : 'users';

      await pb.collection(authCollection).update(user.id, {
        oldPassword: passwords.current,
        password: passwords.new,
        passwordConfirm: passwords.confirm
      });

      // Re-authentifier avec le nouveau mot de passe
      await login(user.email, passwords.new);

      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      if (error.response?.data?.oldPassword) {
        setPasswordError('Le mot de passe actuel est incorrect');
      } else {
        setPasswordError(error.message || 'Erreur lors du changement de mot de passe');
      }
    }

    setPasswordSaving(false);
  };

  const updateSocialLink = (platform, value) => {
    setSite(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const updateFooterBookmaker = (index, field, value) => {
    setSite(prev => {
      const updated = [...prev.footerBookmakers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, footerBookmakers: updated };
    });
  };

  const addFooterBookmaker = () => {
    setSite(prev => ({
      ...prev,
      footerBookmakers: [...prev.footerBookmakers, { name: '', url: '' }]
    }));
  };

  const removeFooterBookmaker = (index) => {
    setSite(prev => ({
      ...prev,
      footerBookmakers: prev.footerBookmakers.filter((_, i) => i !== index)
    }));
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
                  </div>

                  <h3 className={styles.subTitle}>Informations de contact</h3>
                  <div className={styles.form}>
                    <Input
                      label="Email de contact"
                      type="email"
                      value={site.contactEmail}
                      onChange={(e) => setSite({...site, contactEmail: e.target.value})}
                    />
                    <Input
                      label="Téléphone"
                      value={site.contactPhone}
                      onChange={(e) => setSite({...site, contactPhone: e.target.value})}
                    />
                    <Input
                      label="Adresse"
                      value={site.contactAddress}
                      onChange={(e) => setSite({...site, contactAddress: e.target.value})}
                    />
                    <div className={styles.textareaWrapper}>
                      <label className={styles.fieldLabel}>Horaires de disponibilité</label>
                      <textarea
                        className={styles.textarea}
                        value={site.contactHours}
                        onChange={(e) => setSite({...site, contactHours: e.target.value})}
                        rows={3}
                        placeholder="Lundi - Vendredi: 9h - 18h&#10;Samedi: 10h - 16h"
                      />
                    </div>
                  </div>

                  <h3 className={styles.subTitle}>Réseaux sociaux</h3>
                  <div className={styles.form}>
                    <Input
                      label="Facebook"
                      placeholder="https://facebook.com/..."
                      value={site.socialLinks.facebook}
                      onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    />
                    <Input
                      label="Twitter / X"
                      placeholder="https://x.com/..."
                      value={site.socialLinks.twitter}
                      onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    />
                    <Input
                      label="Instagram"
                      placeholder="https://instagram.com/..."
                      value={site.socialLinks.instagram}
                      onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    />
                    <Input
                      label="YouTube"
                      placeholder="https://youtube.com/..."
                      value={site.socialLinks.youtube}
                      onChange={(e) => updateSocialLink('youtube', e.target.value)}
                    />
                  </div>

                  <h3 className={styles.subTitle}>Liens bookmakers (footer)</h3>
                  <div className={styles.form}>
                    {site.footerBookmakers.map((bm, index) => (
                      <div key={index} className={styles.inlineGroup}>
                        <Input
                          label={`Nom ${index + 1}`}
                          value={bm.name}
                          onChange={(e) => updateFooterBookmaker(index, 'name', e.target.value)}
                        />
                        <Input
                          label={`URL ${index + 1}`}
                          value={bm.url}
                          onChange={(e) => updateFooterBookmaker(index, 'url', e.target.value)}
                        />
                        {site.footerBookmakers.length > 1 && (
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeFooterBookmaker(index)}
                            type="button"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    {site.footerBookmakers.length < 6 && (
                      <Button variant="secondary" icon={<Plus size={18} />} onClick={addFooterBookmaker}>
                        Ajouter un lien
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className={styles.section}>
                  <h2>Sécurité</h2>
                  <p className={styles.sectionDesc}>
                    Gérez la sécurité de votre compte
                  </p>
                  {passwordError && (
                    <div className={styles.error}>
                      <AlertCircle size={16} />
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className={styles.success}>
                      <CheckCircle size={16} />
                      Mot de passe modifié avec succès !
                    </div>
                  )}
                  <div className={styles.form}>
                    <Input
                      label="Mot de passe actuel"
                      type="password"
                      placeholder="••••••••"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                    <Input
                      label="Nouveau mot de passe"
                      type="password"
                      placeholder="••••••••"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                    <Input
                      label="Confirmer le mot de passe"
                      type="password"
                      placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                    <Button
                      onClick={handlePasswordChange}
                      variant="secondary"
                      disabled={passwordSaving}
                    >
                      {passwordSaving ? 'Modification...' : 'Changer le mot de passe'}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab !== 'security' && (
                <div className={styles.actions}>
                  {saved && (
                    <span className={styles.savedMessage}>
                      <CheckCircle size={16} /> Modifications enregistrées !
                    </span>
                  )}
                  <Button
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
