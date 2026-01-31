import { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Mail, MoreVertical,
  UserCheck, UserX, Shield, User, Calendar, Filter
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({ name: '', email: '', role: 'viewer', status: 'active' });
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
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

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length
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
                <span className={styles.statValue}>{stats.total}</span>
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
                <span className={styles.statValue}>{stats.active}</span>
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
                <span className={styles.statValue}>{stats.inactive}</span>
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
                <span className={styles.statValue}>{stats.pending}</span>
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
                          {user.name.charAt(0)}
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
                        {user.lastLogin || 'Jamais'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.date}>{user.createdAt}</span>
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
