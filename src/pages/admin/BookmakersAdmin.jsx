import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button, Input, Modal } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './BookmakersAdmin.module.css';

const BookmakersAdmin = () => {
  const { bookmakers, updateBookmaker, addBookmaker, deleteBookmaker } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    bonus: '',
    promoCode: '',
    rating: 4.5,
    link: '',
    color: '#10B981',
    features: []
  });

  const filteredBookmakers = bookmakers.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (bookmaker) => {
    setFormData({
      name: bookmaker.name,
      code: bookmaker.code,
      description: bookmaker.description,
      bonus: bookmaker.bonus,
      promoCode: bookmaker.promoCode,
      rating: bookmaker.rating,
      link: bookmaker.link,
      color: bookmaker.color,
      features: bookmaker.features
    });
    setEditingId(bookmaker.id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      bonus: '',
      promoCode: '',
      rating: 4.5,
      link: '#',
      color: '#10B981',
      features: ['Feature 1', 'Feature 2']
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      gradient: `linear-gradient(135deg, ${formData.color} 0%, ${formData.color}CC 100%)`,
      stats: { users: 0, clicks: 0, conversions: 0 }
    };

    if (editingId) {
      updateBookmaker(editingId, data);
    } else {
      addBookmaker(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteBookmaker(id);
    setDeleteConfirm(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestion des Bookmakers</h1>
            <p className={styles.subtitle}>Ajoutez, modifiez ou supprimez des bookmakers</p>
          </div>
          <Button icon={<Plus size={20} />} onClick={handleAdd}>
            Ajouter un bookmaker
          </Button>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Input
              icon={<Search size={20} />}
              placeholder="Rechercher un bookmaker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {filteredBookmakers.map(bookmaker => (
            <Card key={bookmaker.id} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div
                    className={styles.logo}
                    style={{ background: bookmaker.gradient }}
                  >
                    {bookmaker.name.charAt(0)}
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{bookmaker.name}</h3>
                    <span className={styles.code}>Code: {bookmaker.promoCode}</span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(bookmaker)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteConfirm(bookmaker.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className={styles.description}>{bookmaker.description}</p>

                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{bookmaker.stats.users.toLocaleString()}</span>
                    <span className={styles.statLabel}>Utilisateurs</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{bookmaker.stats.clicks.toLocaleString()}</span>
                    <span className={styles.statLabel}>Clics</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{bookmaker.stats.conversions.toLocaleString()}</span>
                    <span className={styles.statLabel}>Conversions</span>
                  </div>
                </div>

                <div className={styles.bonus}>
                  <span>Bonus: {bookmaker.bonus}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Modifier le bookmaker' : 'Ajouter un bookmaker'}
          size="medium"
        >
          <div className={styles.form}>
            <div className={styles.formRow}>
              <Input
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom du bookmaker"
              />
              <Input
                label="Code promo"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                placeholder="CODE"
              />
            </div>
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du bookmaker"
            />
            <div className={styles.formRow}>
              <Input
                label="Bonus"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                placeholder="100% jusqu'à 200 000 FCFA"
              />
              <Input
                label="Note"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formRow}>
              <Input
                label="Lien"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
              />
              <div className={styles.colorInput}>
                <label>Couleur</label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button icon={<Save size={18} />} onClick={handleSave}>
                Enregistrer
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
            <p>Êtes-vous sûr de vouloir supprimer ce bookmaker ?</p>
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

export default BookmakersAdmin;
