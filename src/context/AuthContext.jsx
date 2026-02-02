import { createContext, useContext, useState, useEffect } from 'react';
import pb from '../services/pocketbase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid) {
      const model = pb.authStore.record || pb.authStore.model;
      setUser(model);
      // Les _superusers n'ont pas de champ role
      if (model?.collectionName === '_superusers' || !model?.role) {
        setUserRole('admin');
      } else {
        setUserRole(model.role || 'viewer');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Essayer d'abord la collection users
      const authData = await pb.collection('users').authWithPassword(email, password);
      const record = authData.record;

      // Vérifier si le compte est actif
      if (record.status === 'inactive') {
        pb.authStore.clear();
        return { success: false, error: 'Votre compte est désactivé.' };
      }

      setUser(record);
      setUserRole(record.role || 'viewer');

      // Mettre à jour lastLogin
      try {
        await pb.collection('users').update(record.id, {
          lastLogin: new Date().toISOString()
        });
      } catch (e) {
        // non-critique
      }

      return { success: true };
    } catch (userError) {
      // Fallback: essayer _superusers
      try {
        const authData = await pb.collection('_superusers').authWithPassword(email, password);
        setUser(authData.record);
        setUserRole('admin');
        return { success: true };
      } catch (superError) {
        return { success: false, error: 'Email ou mot de passe incorrect.' };
      }
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
