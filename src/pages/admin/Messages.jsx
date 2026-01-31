import { useState, useEffect } from 'react';
import {
  Mail, Trash2, Eye, Search, Filter, CheckCircle,
  Clock, MailOpen, Reply
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout';
import { Card, Button, Input, Modal } from '../../components/ui';
import { useData } from '../../context/DataContext';
import styles from './Messages.module.css';

const Messages = () => {
  const { contactMessages, updateContactMessage, deleteContactMessage } = useData();
  const [messages, setMessages] = useState(contactMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Synchroniser avec contactMessages
  useEffect(() => {
    setMessages(contactMessages);
  }, [contactMessages]);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !msg.read) ||
      (filter === 'read' && msg.read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const handleView = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      updateContactMessage(message.id, { read: true });
    }
  };

  const handleDelete = (id) => {
    deleteContactMessage(id);
    setDeleteConfirm(null);
    setSelectedMessage(null);
  };

  const handleReply = (email, subject) => {
    window.open(`mailto:${email}?subject=Re: ${subject}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Messages</h1>
            <p className={styles.subtitle}>
              Messages reçus via le formulaire de contact
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount} non lu(s)</span>
              )}
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <Card className={styles.messagesCard}>
            <div className={styles.cardHeader}>
              <div className={styles.searchWrapper}>
                <Input
                  icon={<Search size={20} />}
                  placeholder="Rechercher un message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.filterTabs}>
                <button
                  className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                  onClick={() => setFilter('all')}
                >
                  Tous ({messages.length})
                </button>
                <button
                  className={`${styles.filterTab} ${filter === 'unread' ? styles.active : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  Non lus ({unreadCount})
                </button>
                <button
                  className={`${styles.filterTab} ${filter === 'read' ? styles.active : ''}`}
                  onClick={() => setFilter('read')}
                >
                  Lus ({messages.length - unreadCount})
                </button>
              </div>
            </div>

            <div className={styles.messagesList}>
              {filteredMessages.length > 0 ? filteredMessages.map(message => (
                <div
                  key={message.id}
                  className={`${styles.messageItem} ${!message.read ? styles.unread : ''}`}
                  onClick={() => handleView(message)}
                >
                  <div className={styles.messageIcon}>
                    {message.read ? <MailOpen size={20} /> : <Mail size={20} />}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageName}>{message.name}</span>
                      <span className={styles.messageEmail}>{message.email}</span>
                    </div>
                    <div className={styles.messageSubject}>{message.subject}</div>
                    <div className={styles.messagePreview}>
                      {message.message.substring(0, 100)}...
                    </div>
                  </div>
                  <div className={styles.messageInfo}>
                    <span className={styles.messageTime}>
                      <Clock size={14} />
                      {formatDate(message.created)}
                    </span>
                    {!message.read && <span className={styles.newBadge}>Nouveau</span>}
                  </div>
                </div>
              )) : (
                <div className={styles.empty}>
                  <Mail size={48} />
                  <p>Aucun message</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Modal de visualisation */}
        <Modal
          isOpen={selectedMessage !== null}
          onClose={() => setSelectedMessage(null)}
          title="Message"
          size="large"
        >
          {selectedMessage && (
            <div className={styles.messageDetail}>
              <div className={styles.detailHeader}>
                <div className={styles.detailInfo}>
                  <h3>{selectedMessage.subject}</h3>
                  <p>
                    <strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedMessage.created)}
                  </p>
                </div>
              </div>
              <div className={styles.detailBody}>
                <p>{selectedMessage.message}</p>
              </div>
              <div className={styles.detailActions}>
                <Button
                  variant="secondary"
                  icon={<Reply size={18} />}
                  onClick={() => handleReply(selectedMessage.email, selectedMessage.subject)}
                >
                  Répondre
                </Button>
                <Button
                  variant="danger"
                  icon={<Trash2 size={18} />}
                  onClick={() => setDeleteConfirm(selectedMessage.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de confirmation de suppression */}
        <Modal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmer la suppression"
          size="small"
        >
          <div className={styles.deleteModal}>
            <p>Êtes-vous sûr de vouloir supprimer ce message ?</p>
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

export default Messages;
