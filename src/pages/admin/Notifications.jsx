import { useState } from 'react';
import {
  Bell, Check, Trash2, Settings, Filter, CheckCheck,
  TrendingUp, UserPlus, AlertCircle, DollarSign, MessageSquare,
  Clock, MoreVertical, Archive, Eye, Plus, MousePointerClick
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './Notifications.module.css';

// Map des icônes
const iconMap = {
  TrendingUp,
  UserPlus,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Plus,
  MousePointerClick,
  Bell
};

const Notifications = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    setNotifications,
    settings,
    updateSettings
  } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    markNotificationRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsRead();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(id => deleteNotification(id));
    setSelectedNotifications([]);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const notificationSettings = [
    { id: 'conversions', label: 'Conversions', enabled: settings?.notifications?.conversions ?? true },
    { id: 'newUsers', label: 'Nouveaux utilisateurs', enabled: settings?.notifications?.newUsers ?? true },
    { id: 'emailAlerts', label: 'Alertes par email', enabled: settings?.notifications?.emailAlerts ?? true },
    { id: 'weeklyReport', label: 'Rapport hebdomadaire', enabled: settings?.notifications?.weeklyReport ?? false }
  ];

  const [localSettings, setLocalSettings] = useState(notificationSettings);

  const toggleSetting = (id) => {
    setLocalSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
    // Sauvegarder dans le contexte
    const setting = localSettings.find(s => s.id === id);
    if (setting) {
      updateSettings({
        notifications: {
          ...settings.notifications,
          [id]: !setting.enabled
        }
      });
    }
  };

  // Calculer les vraies statistiques
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const notifStats = {
    today: notifications.filter(n => new Date(n.createdAt) >= startOfDay).length,
    week: notifications.filter(n => new Date(n.createdAt) >= startOfWeek).length,
    month: notifications.filter(n => new Date(n.createdAt) >= startOfMonth).length
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>
              Gérez vos notifications et alertes
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount} non lues</span>
              )}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              icon={<CheckCheck size={18} />}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Tout marquer comme lu
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            <Card className={styles.notificationsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.filterTabs}>
                  <button
                    className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    Toutes ({notifications.length})
                  </button>
                  <button
                    className={`${styles.filterTab} ${filter === 'unread' ? styles.active : ''}`}
                    onClick={() => setFilter('unread')}
                  >
                    Non lues ({unreadCount})
                  </button>
                  <button
                    className={`${styles.filterTab} ${filter === 'read' ? styles.active : ''}`}
                    onClick={() => setFilter('read')}
                  >
                    Lues ({notifications.length - unreadCount})
                  </button>
                </div>
                {selectedNotifications.length > 0 && (
                  <div className={styles.bulkActions}>
                    <span>{selectedNotifications.length} sélectionnée(s)</span>
                    <Button
                      variant="danger"
                      size="small"
                      icon={<Trash2 size={16} />}
                      onClick={handleDeleteSelected}
                    >
                      Supprimer
                    </Button>
                  </div>
                )}
              </div>

              <div className={styles.selectAll}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                  />
                  <span className={styles.checkmark}></span>
                  Sélectionner tout
                </label>
              </div>

              <div className={styles.notificationsList}>
                {filteredNotifications.map(notification => {
                  const Icon = iconMap[notification.icon] || Bell;
                  return (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    >
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => handleToggleSelect(notification.id)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>

                      <div
                        className={styles.notificationIcon}
                        style={{ background: `${notification.color || '#3B82F6'}20`, color: notification.color || '#3B82F6' }}
                      >
                        <Icon size={20} />
                      </div>

                      <div className={styles.notificationContent}>
                        <div className={styles.notificationHeader}>
                          <h4>{notification.title}</h4>
                          {!notification.read && <span className={styles.newBadge}>Nouveau</span>}
                        </div>
                        <p>{notification.message}</p>
                        <span className={styles.notificationTime}>
                          <Clock size={14} />
                          {notification.time}
                        </span>
                      </div>

                      <div className={styles.notificationActions}>
                        {!notification.read && (
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Marquer comme lu"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(notification.id)}
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredNotifications.length === 0 && (
                  <div className={styles.empty}>
                    <Bell size={48} />
                    <p>Aucune notification</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className={styles.sidebar}>
            <Card className={styles.settingsCard}>
              <div className={styles.settingsHeader}>
                <Settings size={20} />
                <h3>Préférences</h3>
              </div>
              <div className={styles.settingsList}>
                {localSettings.map(setting => (
                  <div key={setting.id} className={styles.settingItem}>
                    <span>{setting.label}</span>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => toggleSetting(setting.id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card className={styles.statsCard}>
              <h3>Statistiques</h3>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Aujourd'hui</span>
                  <span className={styles.statValue}>{notifStats.today}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Cette semaine</span>
                  <span className={styles.statValue}>{notifStats.week}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Ce mois</span>
                  <span className={styles.statValue}>{notifStats.month}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
