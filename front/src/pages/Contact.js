import ContactForm from '../components/ContactForm';

const Contact = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Contact</span>
      <h1>Contact</h1>
      <p>12 rue des Ateliers, 75011 Paris · hello@cyramik.studio · Mar-Dim</p>
    </section>
    <div className="two-column">
      <div className="info-panel">
        <strong>Acces</strong>
        <p>Metro Voltaire, velos devant le studio, accueil PMR sur demande.</p>
      </div>
      <ContactForm />
    </div>
  </main>
);

export default Contact;
