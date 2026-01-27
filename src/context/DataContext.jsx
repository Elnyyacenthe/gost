import { createContext, useContext, useState } from 'react';
import { bookmakers as initialBookmakers, siteStats, recentActivities, chartData } from '../data/bookmakers';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [bookmakers, setBookmakers] = useState(initialBookmakers);
  const [stats, setStats] = useState(siteStats);
  const [activities, setActivities] = useState(recentActivities);
  const [analytics, setAnalytics] = useState(chartData);

  const updateBookmaker = (id, data) => {
    setBookmakers(prev =>
      prev.map(b => b.id === id ? { ...b, ...data } : b)
    );
  };

  const addBookmaker = (data) => {
    const newId = Math.max(...bookmakers.map(b => b.id)) + 1;
    setBookmakers(prev => [...prev, { ...data, id: newId }]);
  };

  const deleteBookmaker = (id) => {
    setBookmakers(prev => prev.filter(b => b.id !== id));
  };

  const recordClick = (bookmakerId) => {
    setBookmakers(prev =>
      prev.map(b =>
        b.id === bookmakerId
          ? { ...b, stats: { ...b.stats, clicks: b.stats.clicks + 1 } }
          : b
      )
    );
    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1
    }));
  };

  const value = {
    bookmakers,
    stats,
    activities,
    analytics,
    updateBookmaker,
    addBookmaker,
    deleteBookmaker,
    recordClick,
    setStats,
    setActivities,
    setAnalytics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
