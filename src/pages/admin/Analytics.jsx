import { TrendingUp, Users, MousePointerClick, DollarSign, Calendar } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AdminSidebar } from '../../components/layout';
import { Card } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './Analytics.module.css';

const Analytics = () => {
  const { bookmakers, analytics } = useData();

  const pieData = bookmakers.map(b => ({
    name: b.name,
    value: b.stats.clicks,
    color: b.color
  }));

  const conversionData = bookmakers.map(b => ({
    name: b.name,
    taux: ((b.stats.conversions / b.stats.clicks) * 100).toFixed(1),
    conversions: b.stats.conversions
  }));

  const monthlyData = [
    { month: 'Jan', revenus: 12000, clics: 45000 },
    { month: 'Fév', revenus: 15000, clics: 52000 },
    { month: 'Mar', revenus: 18000, clics: 61000 },
    { month: 'Avr', revenus: 22000, clics: 75000 },
    { month: 'Mai', revenus: 25000, clics: 82000 },
    { month: 'Juin', revenus: 28000, clics: 95000 },
  ];

  const trafficSources = [
    { name: 'Recherche organique', value: 45, color: '#10B981' },
    { name: 'Direct', value: 25, color: '#3B82F6' },
    { name: 'Réseaux sociaux', value: 20, color: '#F59E0B' },
    { name: 'Référents', value: 10, color: '#8B5CF6' },
  ];

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Analytiques</h1>
            <p className={styles.subtitle}>Statistiques détaillées de votre site</p>
          </div>
          <div className={styles.dateFilter}>
            <Calendar size={18} />
            <span>30 derniers jours</span>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <div className={styles.chartContent}>
              <h3>Évolution des revenus</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${(value * 655).toLocaleString()} FCFA`, 'Revenus']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenus"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorRevenu)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className={styles.chartCard}>
            <div className={styles.chartContent}>
              <h3>Répartition des clics par bookmaker</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [value.toLocaleString(), 'Clics']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <div className={styles.chartContent}>
              <h3>Taux de conversion par bookmaker</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94A3B8" unit="%" />
                    <YAxis dataKey="name" type="category" stroke="#94A3B8" width={80} />
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Taux de conversion']}
                    />
                    <Bar dataKey="taux" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className={styles.chartCard}>
            <div className={styles.chartContent}>
              <h3>Sources de trafic</h3>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Part']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        <Card className={styles.fullChartCard}>
          <div className={styles.chartContent}>
            <h3>Activité hebdomadaire</h3>
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height={350}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    name="Visites"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    name="Clics"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    name="Conversions"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
