import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Zap, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
        <div className={styles.grid}></div>
      </div>

      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <Zap size={32} />
              </div>
              <h1 className={styles.title}>BetPromo Admin</h1>
              <p className={styles.subtitle}>Connectez-vous pour accéder au dashboard</p>
            </div>

            {error && (
              <div className={styles.error}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@betpromo.com"
                icon={<Mail size={20} />}
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={20} />}
                required
              />
              <Button type="submit" fullWidth size="large" loading={loading}>
                Se connecter
              </Button>
            </form>

            <div className={styles.demo}>
              <p>Identifiants de démonstration :</p>
              <code>admin@betpromo.com / admin123</code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
