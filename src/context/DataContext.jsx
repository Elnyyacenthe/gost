import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  bookmarkersService,
  statsService,
  activitiesService,
  analyticsService,
  usersService,
  notificationsService,
  settingsService,
  messagesService
} from '../services/pocketbase';

const DataContext = createContext(null);

// Données par défaut
const defaultStats = {
  totalVisitors: 0,
  totalClicks: 0,
  totalConversions: 0,
  conversionRate: 0,
  revenue: 0
};

const defaultSettings = {
  profile: { name: 'Administrateur', email: 'admin@betpromo.com', phone: '' },
  site: {
    siteName: 'BetPromo',
    siteUrl: '',
    contactEmail: 'contact@betpromo.com',
    contactPhone: '+33 1 23 45 67 89',
    contactAddress: 'Paris, France',
    contactHours: 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé',
    socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '' },
    footerBookmakers: [
      { name: 'Mosbet', url: '/bookmaker/1' },
      { name: '1xbet', url: '/bookmaker/2' },
      { name: 'Melbet', url: '/bookmaker/3' },
      { name: '888starz', url: '/bookmaker/4' }
    ]
  },
  notifications: { emailAlerts: true, newUsers: true, conversions: true, weeklyReport: false }
};

const defaultAnalytics = [
  { name: "Lun", dayIndex: 1, visits: 0, clicks: 0, conversions: 0 },
  { name: "Mar", dayIndex: 2, visits: 0, clicks: 0, conversions: 0 },
  { name: "Mer", dayIndex: 3, visits: 0, clicks: 0, conversions: 0 },
  { name: "Jeu", dayIndex: 4, visits: 0, clicks: 0, conversions: 0 },
  { name: "Ven", dayIndex: 5, visits: 0, clicks: 0, conversions: 0 },
  { name: "Sam", dayIndex: 6, visits: 0, clicks: 0, conversions: 0 },
  { name: "Dim", dayIndex: 0, visits: 0, clicks: 0, conversions: 0 },
];

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [bookmakers, setBookmakers] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [statsId, setStatsId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsId, setSettingsId] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Charger toutes les données au démarrage
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setDbError(null);

      try {
        // Charger en parallèle
        const [
          bookmakersData,
          statsData,
          activitiesData,
          analyticsData,
          usersData,
          notificationsData,
          settingsData,
          messagesData
        ] = await Promise.all([
          bookmarkersService.getAll(),
          statsService.get(),
          activitiesService.getAll(),
          analyticsService.getAll(),
          usersService.getAll(),
          notificationsService.getAll(),
          settingsService.get(),
          messagesService.getAll()
        ]);

        setBookmakers(bookmakersData);

        if (statsData) {
          setStats({
            totalVisitors: statsData.totalVisitors || 0,
            totalClicks: statsData.totalClicks || 0,
            totalConversions: statsData.totalConversions || 0,
            conversionRate: statsData.conversionRate || 0,
            revenue: statsData.revenue || 0
          });
          setStatsId(statsData.id);
        } else {
          // Créer les stats initiales
          const newStats = await statsService.create(defaultStats);
          setStatsId(newStats.id);
        }

        setActivities(activitiesData);

        if (analyticsData.length > 0) {
          setAnalytics(analyticsData.map(a => ({
            id: a.id,
            name: a.name,
            dayIndex: a.dayIndex,
            visits: a.visits || 0,
            clicks: a.clicks || 0,
            conversions: a.conversions || 0
          })));
        } else {
          // Créer les analytics initiales
          const createdAnalytics = await Promise.all(
            defaultAnalytics.map(day => analyticsService.create(day))
          );
          setAnalytics(createdAnalytics.map(a => ({
            id: a.id,
            name: a.name,
            dayIndex: a.dayIndex,
            visits: a.visits || 0,
            clicks: a.clicks || 0,
            conversions: a.conversions || 0
          })));
        }

        setUsers(usersData);
        setNotifications(notificationsData);

        if (settingsData) {
          setSettings({
            profile: settingsData.profile || defaultSettings.profile,
            site: settingsData.site || defaultSettings.site,
            notifications: settingsData.notifications || defaultSettings.notifications
          });
          setSettingsId(settingsData.id);
        } else {
          // Créer les settings initiales
          const newSettings = await settingsService.create(defaultSettings);
          setSettingsId(newSettings.id);
        }

        setContactMessages(messagesData);
      } catch (error) {
        console.error('Erreur chargement données:', error);
        setDbError('Impossible de se connecter à PocketBase. Vérifiez que le serveur est lancé.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Ajouter une notification
  const addNotification = useCallback(async (notification) => {
    try {
      const newNotification = await notificationsService.create({
        ...notification,
        read: false,
        time: new Date().toLocaleString('fr-FR')
      });
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Erreur ajout notification:', error);
    }
  }, []);

  // Ajouter une activité
  const addActivity = useCallback(async (activity) => {
    try {
      const newActivity = await activitiesService.create({
        ...activity,
        time: new Date().toLocaleString('fr-FR')
      });
      setActivities(prev => [newActivity, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Erreur ajout activité:', error);
    }
  }, []);

  // Mettre à jour les analytics quotidiennes
  const updateDailyAnalytics = useCallback(async (type) => {
    const todayIndex = new Date().getDay();
    const dayRecord = analytics.find(day => day.dayIndex === todayIndex);

    if (dayRecord && dayRecord.id) {
      try {
        const updated = await analyticsService.update(dayRecord.id, {
          [type]: (dayRecord[type] || 0) + 1
        });
        setAnalytics(prev =>
          prev.map(day =>
            day.id === dayRecord.id
              ? { ...day, [type]: (day[type] || 0) + 1 }
              : day
          )
        );
      } catch (error) {
        console.error('Erreur update analytics:', error);
      }
    }
  }, [analytics]);

  const updateBookmaker = useCallback(async (id, data) => {
    try {
      const updated = await bookmarkersService.update(id, data);
      setBookmakers(prev =>
        prev.map(b => b.id === id ? { ...b, ...updated } : b)
      );
    } catch (error) {
      console.error('Erreur update bookmaker:', error);
    }
  }, []);

  const addBookmaker = useCallback(async (data) => {
    try {
      const newBookmaker = await bookmarkersService.create({
        ...data,
        clicks: 0,
        conversions: 0
      });
      setBookmakers(prev => [...prev, newBookmaker]);

      await addNotification({
        type: 'bookmaker',
        title: 'Nouveau bookmaker ajouté',
        message: `${data.name} a été ajouté à la liste`,
        icon: 'Plus',
        color: '#10B981'
      });

      await addActivity({
        type: 'add',
        message: `Bookmaker "${data.name}" ajouté`,
        icon: 'Plus'
      });

      return newBookmaker;
    } catch (error) {
      console.error('Erreur ajout bookmaker:', error);
      throw error;
    }
  }, [addNotification, addActivity]);

  const deleteBookmaker = useCallback(async (id) => {
    const bookmaker = bookmakers.find(b => b.id === id);
    try {
      await bookmarkersService.delete(id);
      setBookmakers(prev => prev.filter(b => b.id !== id));

      if (bookmaker) {
        await addActivity({
          type: 'delete',
          message: `Bookmaker "${bookmaker.name}" supprimé`,
          icon: 'Trash2'
        });
      }
    } catch (error) {
      console.error('Erreur suppression bookmaker:', error);
    }
  }, [bookmakers, addActivity]);

  const recordClick = useCallback(async (bookmakerId) => {
    const bookmaker = bookmakers.find(b => b.id === bookmakerId);

    if (bookmaker) {
      try {
        // Mettre à jour le bookmaker
        await bookmarkersService.update(bookmakerId, {
          clicks: (bookmaker.clicks || 0) + 1
        });
        setBookmakers(prev =>
          prev.map(b =>
            b.id === bookmakerId
              ? { ...b, clicks: (b.clicks || 0) + 1 }
              : b
          )
        );

        // Mettre à jour les stats globales
        if (statsId) {
          const newTotalClicks = stats.totalClicks + 1;
          await statsService.update(statsId, { totalClicks: newTotalClicks });
          setStats(prev => ({ ...prev, totalClicks: newTotalClicks }));
        }

        await updateDailyAnalytics('clicks');

        await addActivity({
          type: 'click',
          message: `Clic sur ${bookmaker.name}`,
          icon: 'MousePointerClick'
        });
      } catch (error) {
        console.error('Erreur enregistrement clic:', error);
      }
    }
  }, [bookmakers, stats, statsId, updateDailyAnalytics, addActivity]);

  const recordVisit = useCallback(async () => {
    try {
      if (statsId) {
        const newTotalVisitors = stats.totalVisitors + 1;
        await statsService.update(statsId, { totalVisitors: newTotalVisitors });
        setStats(prev => ({ ...prev, totalVisitors: newTotalVisitors }));
      }
      await updateDailyAnalytics('visits');
    } catch (error) {
      console.error('Erreur enregistrement visite:', error);
    }
  }, [stats, statsId, updateDailyAnalytics]);

  const recordConversion = useCallback(async (bookmakerId) => {
    const bookmaker = bookmakers.find(b => b.id === bookmakerId);

    if (bookmaker) {
      try {
        // Mettre à jour le bookmaker
        await bookmarkersService.update(bookmakerId, {
          conversions: (bookmaker.conversions || 0) + 1
        });
        setBookmakers(prev =>
          prev.map(b =>
            b.id === bookmakerId
              ? { ...b, conversions: (b.conversions || 0) + 1 }
              : b
          )
        );

        // Mettre à jour les stats globales
        if (statsId) {
          const newTotalConversions = stats.totalConversions + 1;
          await statsService.update(statsId, { totalConversions: newTotalConversions });
          setStats(prev => ({ ...prev, totalConversions: newTotalConversions }));
        }

        await updateDailyAnalytics('conversions');

        await addNotification({
          type: 'conversion',
          title: 'Nouvelle conversion',
          message: `Un utilisateur s'est inscrit via ${bookmaker.name}`,
          icon: 'TrendingUp',
          color: '#F59E0B'
        });

        await addActivity({
          type: 'conversion',
          message: `Conversion via ${bookmaker.name}`,
          icon: 'TrendingUp'
        });
      } catch (error) {
        console.error('Erreur enregistrement conversion:', error);
      }
    }
  }, [bookmakers, stats, statsId, updateDailyAnalytics, addNotification, addActivity]);

  // Gestion des utilisateurs admin
  const addUser = useCallback(async (userData) => {
    try {
      const newUser = await usersService.create({
        ...userData,
        lastLogin: null
      });
      setUsers(prev => [...prev, newUser]);

      await addNotification({
        type: 'user',
        title: 'Nouvel utilisateur',
        message: `${userData.name} a été ajouté`,
        icon: 'UserPlus',
        color: '#3B82F6'
      });

      return newUser;
    } catch (error) {
      console.error('Erreur ajout utilisateur:', error);
      throw error;
    }
  }, [addNotification]);

  const updateUser = useCallback(async (id, data) => {
    try {
      const updated = await usersService.update(id, data);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    } catch (error) {
      console.error('Erreur update utilisateur:', error);
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await usersService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
    }
  }, []);

  // Gestion des messages de contact
  const addContactMessage = useCallback(async (message) => {
    try {
      const newMessage = await messagesService.create({
        ...message,
        read: false
      });
      setContactMessages(prev => [newMessage, ...prev]);

      await addNotification({
        type: 'message',
        title: 'Nouveau message de contact',
        message: `${message.name} vous a envoyé un message`,
        icon: 'MessageSquare',
        color: '#8B5CF6'
      });

      return newMessage;
    } catch (error) {
      console.error('Erreur ajout message:', error);
      throw error;
    }
  }, [addNotification]);

  const updateContactMessage = useCallback(async (id, data) => {
    try {
      const updated = await messagesService.update(id, data);
      setContactMessages(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    } catch (error) {
      console.error('Erreur update message:', error);
    }
  }, []);

  const deleteContactMessage = useCallback(async (id) => {
    try {
      await messagesService.delete(id);
      setContactMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Erreur suppression message:', error);
    }
  }, []);

  // Marquer notification comme lue
  const markNotificationRead = useCallback(async (id) => {
    try {
      await notificationsService.update(id, { read: true });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n =>
          notificationsService.update(n.id, { read: true })
        )
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erreur marquage notifications:', error);
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (id) => {
    try {
      await notificationsService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  }, []);

  // Mettre à jour les paramètres
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const merged = { ...settings, ...newSettings };
      if (settingsId) {
        await settingsService.update(settingsId, merged);
      } else {
        const created = await settingsService.create(merged);
        setSettingsId(created.id);
      }
      setSettings(merged);
    } catch (error) {
      console.error('Erreur update settings:', error);
    }
  }, [settings, settingsId]);

  const value = {
    // État
    isLoading,
    dbError,
    // Données
    bookmakers,
    stats,
    activities,
    analytics,
    users,
    notifications,
    settings,
    contactMessages,
    // Actions bookmakers
    updateBookmaker,
    addBookmaker,
    deleteBookmaker,
    recordClick,
    recordVisit,
    recordConversion,
    // Actions users
    addUser,
    updateUser,
    deleteUser,
    // Actions notifications
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    // Actions settings
    updateSettings,
    // Actions contact
    addContactMessage,
    updateContactMessage,
    deleteContactMessage,
    // Setters directs (pour compatibilité)
    setStats,
    setActivities,
    setAnalytics,
    setUsers,
    setNotifications
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
