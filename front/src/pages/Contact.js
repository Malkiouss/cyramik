import ContactForm from '../components/ContactForm';

const Contact = () => (
  <main className="page page-offset two-column">
    <section className="page-hero compact">
      <span className="eyebrow">Contact</span>
      <h1>Parlez-nous de votre visite, atelier ou evenement.</h1>
      <p>12 rue des Ateliers, 75011 Paris · hello@cyramik.studio · Mar-Dim</p>
      <div className="info-panel">
        <strong>Acces</strong>
        <p>Metro Voltaire, velos devant le studio, accueil PMR sur demande.</p>
      </div>
    </section>
    <ContactForm />
  </main>
);

export default Contact;
