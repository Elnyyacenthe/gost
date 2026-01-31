import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Layers,
  LogOut,
  Zap,
  Bell,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { settings } = useData();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/bookmakers', icon: Layers, label: 'Bookmakers' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytiques' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
    { path: '/admin/reports', icon: FileText, label: 'Rapports' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Link to="/" className={styles.logo}>
          <Zap className={styles.logoIcon} />
          <span className={styles.logoText}>BetPromo</span>
        </Link>
        <span className={styles.badge}>Admin</span>
      </div>

      <div className={styles.user}>
        <div className={styles.avatar}>
          {(settings?.profile?.name || user?.name || 'A').charAt(0)}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{settings?.profile?.name || user?.name || 'Admin'}</span>
          <span className={styles.userRole}>Administrateur</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${styles.menuItem} ${isActive(item.path, item.exact) ? styles.active : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
