import { useState } from 'react';
import {
  Bell, Check, Trash2, Settings, Filter, CheckCheck,
  TrendingUp, UserPlus, AlertCircle, DollarSign, MessageSquare,
  Clock, MoreVertical, Archive, Eye
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button } from '../../components/ui';
import styles from './Notifications.module.css';

// Données initiales vides - L'administrateur verra les notifications au fur et à mesure
const initialNotifications = [];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteSelected = () => {
    setNotifications(prev =>
      prev.filter(n => !selectedNotifications.includes(n.id))
    );
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
    { id: 'conversions', label: 'Conversions', enabled: true },
    { id: 'users', label: 'Nouveaux utilisateurs', enabled: true },
    { id: 'alerts', label: 'Alertes système', enabled: true },
    { id: 'revenue', label: 'Objectifs de revenus', enabled: false },
    { id: 'messages', label: 'Messages de contact', enabled: true }
  ];

  const [settings, setSettings] = useState(notificationSettings);

  const toggleSetting = (id) => {
    setSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
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
                  const Icon = notification.icon;
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
                        style={{ background: `${notification.color}20`, color: notification.color }}
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
                {settings.map(setting => (
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
                  <span className={styles.statValue}>12</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Cette semaine</span>
                  <span className={styles.statValue}>58</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Ce mois</span>
                  <span className={styles.statValue}>234</span>
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
