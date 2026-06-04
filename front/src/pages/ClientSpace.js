const ClientSpace = () => (
  <main className="page page-offset two-column">
    <section className="page-hero compact">
      <span className="eyebrow">Espace client</span>
      <h1>Retrouvez vos reservations et vos coups de coeur.</h1>
      <p>Connexion demo prete pour brancher JWT, historique des ateliers et suivi boutique.</p>
    </section>
    <form className="form-card">
      <h3>Connexion</h3>
      <input placeholder="Email" type="email" />
      <input placeholder="Mot de passe" type="password" />
      <button className="btn btn-primary" type="button">Se connecter</button>
    </form>
  </main>
);

export default ClientSpace;
