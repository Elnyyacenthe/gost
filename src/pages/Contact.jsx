import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Navbar, Footer } from '../components/layout';
import { Button, Input, Card } from '../components/ui';
import { useData } from '../context/DataContext';
import styles from './Contact.module.css';

// Configuration EmailJS - à remplacer par vos propres clés
const EMAILJS_SERVICE_ID = 'service_betpromo'; // Remplacez par votre Service ID
const EMAILJS_TEMPLATE_ID = 'template_contact'; // Remplacez par votre Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Remplacez par votre Public Key

const Contact = () => {
  const formRef = useRef();
  const { addContactMessage, settings } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    // Sauvegarder le message localement dans tous les cas
    addContactMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });

    // Essayer d'envoyer via EmailJS si configuré
    if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      try {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
          EMAILJS_PUBLIC_KEY
        );
      } catch (err) {
        console.log('EmailJS non configuré ou erreur:', err);
        // On continue quand même car le message est sauvegardé localement
      }
    }

    setSending(false);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="page">
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <MessageSquare size={40} />
            </div>
            <h1 className={styles.title}>
              Contactez-<span className="gradient-text">nous</span>
            </h1>
            <p className={styles.subtitle}>
              Une question ? N'hésitez pas à nous contacter, nous vous répondrons rapidement
            </p>
          </div>

          <div className={styles.content}>
            <Card className={styles.formCard}>
              <div className={styles.formContent}>
                <h2>Envoyez-nous un message</h2>

                {submitted ? (
                  <div className={styles.success}>
                    <div className={styles.successIcon}>
                      <CheckCircle size={32} />
                    </div>
                    <h3>Message envoyé !</h3>
                    <p>Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                      <div className={styles.error}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                      </div>
                    )}
                    <div className={styles.row}>
                      <Input
                        label="Nom complet"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        disabled={sending}
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                        disabled={sending}
                      />
                    </div>
                    <Input
                      label="Sujet"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      required
                      disabled={sending}
                    />
                    <div className={styles.textareaWrapper}>
                      <label className={styles.label}>Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Votre message..."
                        rows={5}
                        required
                        disabled={sending}
                        className={styles.textarea}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="large"
                      icon={<Send size={18} />}
                      iconPosition="right"
                      disabled={sending}
                    >
                      {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </form>
                )}
              </div>
            </Card>

            <div className={styles.info}>
              <Card className={styles.infoCard}>
                <div className={styles.infoContent}>
                  <div className={styles.infoIcon}>
                    <Mail size={24} />
                  </div>
                  <h3>Email</h3>
                  <p>{settings?.site?.contactEmail || 'contact@betpromo.com'}</p>
                </div>
              </Card>

              <Card className={styles.infoCard}>
                <div className={styles.infoContent}>
                  <div className={styles.infoIcon}>
                    <Phone size={24} />
                  </div>
                  <h3>Téléphone</h3>
                  <p>{settings?.site?.contactPhone || '+33 1 23 45 67 89'}</p>
                </div>
              </Card>

              <Card className={styles.infoCard}>
                <div className={styles.infoContent}>
                  <div className={styles.infoIcon}>
                    <MapPin size={24} />
                  </div>
                  <h3>Adresse</h3>
                  <p>{settings?.site?.contactAddress || 'Paris, France'}</p>
                </div>
              </Card>

              <div className={styles.availability}>
                <h4>Horaires de disponibilité</h4>
                {(settings?.site?.contactHours || 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé')
                  .split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
