import { useState } from 'react';
import {
  FileText, Download, Calendar, TrendingUp, TrendingDown,
  DollarSign, Users, MousePointerClick, Eye, Filter,
  ChevronDown, Printer, Mail
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AdminSidebar } from '../../components/layout';
import { Card, Button } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './Reports.module.css';

const Reports = () => {
  const { bookmakers, stats } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const monthlyData = [
    { month: 'Jan', revenus: 12500, clics: 45200, conversions: 1850, visiteurs: 85000 },
    { month: 'Fév', revenus: 15800, clics: 52100, conversions: 2100, visiteurs: 92000 },
    { month: 'Mar', revenus: 18200, clics: 61500, conversions: 2450, visiteurs: 105000 },
    { month: 'Avr', revenus: 22400, clics: 75800, conversions: 2890, visiteurs: 118000 },
    { month: 'Mai', revenus: 25100, clics: 82300, conversions: 3120, visiteurs: 132000 },
    { month: 'Juin', revenus: 28900, clics: 95600, conversions: 3580, visiteurs: 148000 },
  ];

  const bookmakerPerformance = bookmakers.map(b => ({
    name: b.name,
    clics: b.stats.clicks,
    conversions: b.stats.conversions,
    taux: ((b.stats.conversions / b.stats.clicks) * 100).toFixed(1),
    revenus: Math.floor(b.stats.conversions * 15)
  }));

  const weeklyData = [
    { jour: 'Lun', clics: 12500, conversions: 520 },
    { jour: 'Mar', clics: 14200, conversions: 580 },
    { jour: 'Mer', clics: 11800, conversions: 490 },
    { jour: 'Jeu', clics: 15600, conversions: 640 },
    { jour: 'Ven', clics: 18900, conversions: 780 },
    { jour: 'Sam', clics: 22100, conversions: 920 },
    { jour: 'Dim', clics: 19500, conversions: 810 },
  ];

  const summaryCards = [
    {
      title: 'Revenus totaux',
      value: '81 154 500 FCFA',
      change: '+18.5%',
      positive: true,
      icon: DollarSign,
      color: '#10B981'
    },
    {
      title: 'Clics totaux',
      value: '412 500',
      change: '+12.3%',
      positive: true,
      icon: MousePointerClick,
      color: '#3B82F6'
    },
    {
      title: 'Conversions',
      value: '15 990',
      change: '+22.1%',
      positive: true,
      icon: TrendingUp,
      color: '#F59E0B'
    },
    {
      title: 'Taux de conversion',
      value: '3.87%',
      change: '-0.3%',
      positive: false,
      icon: Eye,
      color: '#8B5CF6'
    }
  ];

  const reportTypes = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'bookmakers', label: 'Par bookmaker' },
    { id: 'trends', label: 'Tendances' },
    { id: 'conversions', label: 'Conversions' }
  ];

  const handleExport = (format) => {
    alert(`Export en format ${format} lancé !`);
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Rapports</h1>
            <p className={styles.subtitle}>Analysez vos performances et générez des rapports</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.periodSelector}>
              <Calendar size={18} />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={styles.select}
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div className={styles.exportButtons}>
              <Button
                variant="secondary"
                icon={<Download size={18} />}
                onClick={() => handleExport('PDF')}
              >
                PDF
              </Button>
              <Button
                variant="secondary"
                icon={<Download size={18} />}
                onClick={() => handleExport('Excel')}
              >
                Excel
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.reportTabs}>
          {reportTypes.map(report => (
            <button
              key={report.id}
              className={`${styles.tab} ${selectedReport === report.id ? styles.active : ''}`}
              onClick={() => setSelectedReport(report.id)}
            >
              {report.label}
            </button>
          ))}
        </div>

        <div className={styles.summaryGrid}>
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className={styles.summaryCard}>
                <div className={styles.summaryContent}>
                  <div className={styles.summaryHeader}>
                    <div
                      className={styles.summaryIcon}
                      style={{ background: `${card.color}20`, color: card.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <span className={`${styles.change} ${card.positive ? styles.positive : styles.negative}`}>
                      {card.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {card.change}
                    </span>
                  </div>
                  <div className={styles.summaryValue}>{card.value}</div>
                  <div className={styles.summaryTitle}>{card.title}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className={styles.chartsRow}>
          <Card className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Évolution des revenus</h3>
              <span className={styles.chartPeriod}>6 derniers mois</span>
            </div>
            <div className={styles.chartContent}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorRevenus)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Activité hebdomadaire</h3>
              <span className={styles.chartPeriod}>Cette semaine</span>
            </div>
            <div className={styles.chartContent}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="jour" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      background: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="clics" name="Clics" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" name="Conversions" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Performance par bookmaker</h3>
            <Button variant="ghost" icon={<Download size={18} />}>
              Exporter
            </Button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Bookmaker</th>
                  <th>Clics</th>
                  <th>Conversions</th>
                  <th>Taux de conversion</th>
                  <th>Revenus estimés</th>
                  <th>Tendance</th>
                </tr>
              </thead>
              <tbody>
                {bookmakerPerformance.map((b, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.bookmakerCell}>
                        <div
                          className={styles.bookmakerLogo}
                          style={{ background: bookmakers[index]?.gradient }}
                        >
                          {b.name.charAt(0)}
                        </div>
                        <span>{b.name}</span>
                      </div>
                    </td>
                    <td>{b.clics.toLocaleString()}</td>
                    <td>{b.conversions.toLocaleString()}</td>
                    <td>
                      <span className={styles.conversionRate}>{b.taux}%</span>
                    </td>
                    <td className={styles.revenue}>{(b.revenus * 655).toLocaleString()} FCFA</td>
                    <td>
                      <div className={styles.trend}>
                        <TrendingUp size={16} className={styles.trendUp} />
                        <span>+12%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{bookmakerPerformance.reduce((a, b) => a + b.clics, 0).toLocaleString()}</strong></td>
                  <td><strong>{bookmakerPerformance.reduce((a, b) => a + b.conversions, 0).toLocaleString()}</strong></td>
                  <td><strong>-</strong></td>
                  <td className={styles.revenue}>
                    <strong>{(bookmakerPerformance.reduce((a, b) => a + b.revenus, 0) * 655).toLocaleString()} FCFA</strong>
                  </td>
                  <td>-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <div className={styles.quickActions}>
          <Card className={styles.actionCard}>
            <div className={styles.actionContent}>
              <div className={styles.actionIcon}>
                <Printer size={24} />
              </div>
              <div className={styles.actionInfo}>
                <h4>Imprimer le rapport</h4>
                <p>Générer une version imprimable</p>
              </div>
              <Button variant="secondary" size="small">Imprimer</Button>
            </div>
          </Card>
          <Card className={styles.actionCard}>
            <div className={styles.actionContent}>
              <div className={styles.actionIcon}>
                <Mail size={24} />
              </div>
              <div className={styles.actionInfo}>
                <h4>Envoyer par email</h4>
                <p>Partager ce rapport par email</p>
              </div>
              <Button variant="secondary" size="small">Envoyer</Button>
            </div>
          </Card>
          <Card className={styles.actionCard}>
            <div className={styles.actionContent}>
              <div className={styles.actionIcon}>
                <Calendar size={24} />
              </div>
              <div className={styles.actionInfo}>
                <h4>Planifier un rapport</h4>
                <p>Automatiser l'envoi de rapports</p>
              </div>
              <Button variant="secondary" size="small">Planifier</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
