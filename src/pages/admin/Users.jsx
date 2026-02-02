import { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Mail, MoreVertical,
  UserCheck, UserX, Shield, User, Calendar, Filter, Lock
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button, Input, Modal } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './Users.module.css';

const Users = () => {
  const { users, addUser, updateUser, deleteUser: removeUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'viewer',
    status: 'active'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({ name: '', email: '', password: '', passwordConfirm: '', role: 'viewer', status: 'active' });
    setEditingUser(null);
    setSaveError('');
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      passwordConfirm: '',
      role: user.role || 'viewer',
      status: user.status || 'active'
    });
    setEditingUser(user);
    setSaveError('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaveError('');

    if (!formData.name || !formData.email) {
      setSaveError('Nom et email sont requis');
      return;
    }

    try {
      if (editingUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        };
        if (formData.password) {
          if (formData.password.length < 8) {
            setSaveError('Le mot de passe doit contenir au moins 8 caractères');
            return;
          }
          if (formData.password !== formData.passwordConfirm) {
            setSaveError('Les mots de passe ne correspondent pas');
            return;
          }
          updateData.password = formData.password;
          updateData.passwordConfirm = formData.passwordConfirm;
        }
        await updateUser(editingUser.id, updateData);
      } else {
        if (!formData.password || formData.password.length < 8) {
          setSaveError('Le mot de passe doit contenir au moins 8 caractères');
          return;
        }
        if (formData.password !== formData.passwordConfirm) {
          setSaveError('Les mots de passe ne correspondent pas');
          return;
        }
        await addUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          role: formData.role,
          status: formData.status
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      setSaveError(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = (id) => {
    removeUser(id);
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, {
        status: user.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={16} />;
      case 'editor': return <Edit size={16} />;
      default: return <User size={16} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return styles.roleAdmin;
      case 'editor': return styles.roleEditor;
      default: return styles.roleViewer;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'inactive': return styles.statusInactive;
      default: return styles.statusPending;
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Jamais';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestion des utilisateurs</h1>
            <p className={styles.subtitle}>Gérez les accès et permissions des utilisateurs</p>
          </div>
          <Button icon={<Plus size={20} />} onClick={handleAdd}>
            Ajouter un utilisateur
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <User size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats.total}</span>
                <span className={styles.statLabel}>Total utilisateurs</span>
              </div>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <UserCheck size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats.active}</span>
                <span className={styles.statLabel}>Actifs</span>
              </div>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                <UserX size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats.inactive}</span>
                <span className={styles.statLabel}>Inactifs</span>
              </div>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                <Calendar size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats.pending}</span>
                <span className={styles.statLabel}>En attente</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.searchWrapper}>
              <Input
                icon={<Search size={20} />}
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <Filter size={18} />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className={styles.select}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Éditeur</option>
                  <option value="viewer">Lecteur</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={styles.select}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Dernière connexion</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {(user.name || '?').charAt(0)}
                        </div>
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>{user.name}</span>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(user.status)}`}>
                        {user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'En attente'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.date}>
                        {formatDate(user.lastLogin)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.date}>{formatDate(user.created)}</span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                        >
                          {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleEdit(user)}
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => setDeleteConfirm(user.id)}
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className={styles.empty}>
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          size="medium"
        >
          <div className={styles.form}>
            {saveError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#EF4444',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                {saveError}
              </div>
            )}
            <Input
              label="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom de l'utilisateur"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemple.com"
              required
            />
            {!editingUser ? (
              <>
                <Input
                  label="Mot de passe"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 caractères"
                  icon={<Lock size={18} />}
                  required
                />
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  placeholder="Confirmer le mot de passe"
                  icon={<Lock size={18} />}
                  required
                />
              </>
            ) : (
              <>
                <Input
                  label="Nouveau mot de passe (optionnel)"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Laisser vide pour ne pas changer"
                  icon={<Lock size={18} />}
                />
                {formData.password && (
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    placeholder="Confirmer le mot de passe"
                    icon={<Lock size={18} />}
                  />
                )}
              </>
            )}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="viewer">Lecteur</option>
                  <option value="editor">Éditeur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                {editingUser ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmer la suppression"
          size="small"
        >
          <div className={styles.deleteModal}>
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <p className={styles.deleteWarning}>Cette action est irréversible.</p>
            <div className={styles.deleteActions}>
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Users;
