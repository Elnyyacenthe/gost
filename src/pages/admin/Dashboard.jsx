import {
  Users, MousePointerClick, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Eye, Plus, Trash2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AdminSidebar } from '../../components/layout';
import { Card } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './Dashboard.module.css';

// Map des icônes pour les activités
const activityIcons = {
  click: MousePointerClick,
  conversion: TrendingUp,
  add: Plus,
  delete: Trash2
};

const Dashboard = () => {
  const { bookmakers, stats, activities, analytics, isLoading, dbError } = useData();

  // Afficher un loader ou une erreur
  if (isLoading) {
    return (
      <div className={styles.layout}>
        <AdminSidebar />
        <main className={styles.main}>
          <div className={styles.loading}>Chargement des données...</div>
        </main>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className={styles.layout}>
        <AdminSidebar />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Erreur de connexion</h2>
            <p>{dbError}</p>
            <p>Lancez PocketBase avec: <code>npm run pocketbase</code></p>
          </div>
        </main>
      </div>
    );
  }

  // Calculer les revenus à partir des conversions
  const totalConversions = bookmakers.reduce((sum, b) => sum + (b.conversions || 0), 0);
  const calculatedRevenue = totalConversions * 15 * 655; // 15€ par conversion en FCFA

  const statCards = [
    {
      title: 'Visiteurs totaux',
      value: (stats.totalVisitors || 0).toLocaleString(),
      change: stats.totalVisitors > 0 ? '+12.5%' : '-',
      positive: stats.totalVisitors > 0,
      icon: Users,
      color: '#10B981'
    },
    {
      title: 'Clics totaux',
      value: (stats.totalClicks || 0).toLocaleString(),
      change: stats.totalClicks > 0 ? '+8.2%' : '-',
      positive: stats.totalClicks > 0,
      icon: MousePointerClick,
      color: '#3B82F6'
    },
    {
      title: 'Conversions',
      value: (stats.totalConversions || 0).toLocaleString(),
      change: stats.totalConversions > 0 ? '+15.3%' : '-',
      positive: stats.totalConversions > 0,
      icon: TrendingUp,
      color: '#F59E0B'
    },
    {
      title: 'Revenus estimés',
      value: `${calculatedRevenue.toLocaleString()} FCFA`,
      change: calculatedRevenue > 0 ? '+10.2%' : '-',
      positive: calculatedRevenue > 0,
      icon: DollarSign,
      color: '#8B5CF6'
    }
  ];

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Vue d'ensemble de vos performances</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statHeader}>
                    <div
                      className={styles.statIcon}
                      style={{ background: `${stat.color}20`, color: stat.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
                      {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {stat.change}
                    </div>
                  </div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statTitle}>{stat.title}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <div className={styles.chartContent}>
              <h3>Évolution des visites</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className={styles.chartCard}>
            <div className={styles.chartContent}>
              <h3>Conversions par jour</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="conversions" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.bottomGrid}>
          <Card className={styles.tableCard}>
            <div className={styles.tableContent}>
              <h3>Performance par bookmaker</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Bookmaker</th>
                    <th>Utilisateurs</th>
                    <th>Clics</th>
                    <th>Conversions</th>
                    <th>Taux</th>
                  </tr>
                </thead>
                <tbody>
                  {bookmakers.length > 0 ? bookmakers.map(bookmaker => {
                    const clicks = bookmaker.clicks || 0;
                    const conversions = bookmaker.conversions || 0;
                    const rate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={bookmaker.id}>
                        <td>
                          <div className={styles.bookmakerCell}>
                            <div
                              className={styles.bookmakerLogo}
                              style={{ background: bookmaker.gradient || bookmaker.color || '#3B82F6' }}
                            >
                              {bookmaker.name.charAt(0)}
                            </div>
                            <span>{bookmaker.name}</span>
                          </div>
                        </td>
                        <td>{(bookmaker.users || 0).toLocaleString()}</td>
                        <td>{clicks.toLocaleString()}</td>
                        <td>{conversions.toLocaleString()}</td>
                        <td>
                          <span className={styles.rate}>{rate}%</span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                        Aucun bookmaker ajouté. Allez dans "Bookmakers" pour en ajouter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className={styles.activityCard}>
            <div className={styles.activityContent}>
              <h3>Activité récente</h3>
              <div className={styles.activityList}>
                {activities.length > 0 ? activities.slice(0, 10).map(activity => {
                  const Icon = activityIcons[activity.type] || MousePointerClick;
                  const typeLabels = {
                    click: 'Clic',
                    conversion: 'Conversion',
                    add: 'Ajout',
                    delete: 'Suppression'
                  };
                  return (
                    <div key={activity.id} className={styles.activityItem}>
                      <div className={`${styles.activityIcon} ${styles[activity.type] || ''}`}>
                        <Icon size={16} />
                      </div>
                      <div className={styles.activityInfo}>
                        <span className={styles.activityType}>
                          {typeLabels[activity.type] || activity.type}
                        </span>
                        <span className={styles.activityBookmaker}>
                          {activity.message || `${activity.bookmaker || ''} ${activity.country ? '- ' + activity.country : ''}`}
                        </span>
                      </div>
                      <span className={styles.activityTime}>{activity.time}</span>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    Aucune activité récente
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
