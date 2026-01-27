import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { Button, Input, Card } from '../components/ui';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
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
                      <Send size={32} />
                    </div>
                    <h3>Message envoyé !</h3>
                    <p>Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                      <Input
                        label="Nom complet"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <Input
                      label="Sujet"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      required
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
                        className={styles.textarea}
                      />
                    </div>
                    <Button type="submit" size="large" icon={<Send size={18} />} iconPosition="right">
                      Envoyer le message
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
                  <p>contact@betpromo.com</p>
                </div>
              </Card>

              <Card className={styles.infoCard}>
                <div className={styles.infoContent}>
                  <div className={styles.infoIcon}>
                    <Phone size={24} />
                  </div>
                  <h3>Téléphone</h3>
                  <p>+33 1 23 45 67 89</p>
                </div>
              </Card>

              <Card className={styles.infoCard}>
                <div className={styles.infoContent}>
                  <div className={styles.infoIcon}>
                    <MapPin size={24} />
                  </div>
                  <h3>Adresse</h3>
                  <p>Paris, France</p>
                </div>
              </Card>

              <div className={styles.availability}>
                <h4>Horaires de disponibilité</h4>
                <p>Lundi - Vendredi: 9h - 18h</p>
                <p>Samedi: 10h - 16h</p>
                <p>Dimanche: Fermé</p>
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
