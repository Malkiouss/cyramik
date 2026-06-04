const ClientSpace = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Espace client</span>
      <h1>Espace client</h1>
      <p>Connexion demo prete pour brancher JWT, historique des ateliers et suivi boutique.</p>
    </section>
    <div className="two-column">
      <div className="info-panel">
        <strong>Vos reservations</strong>
        <p>Retrouvez bientot vos ateliers, commandes et favoris Coffee Arts Paris dans un espace dedie.</p>
      </div>
      <form className="form-card">
        <h3>Connexion</h3>
        <input placeholder="Email" type="email" />
        <input placeholder="Mot de passe" type="password" />
        <button className="btn btn-primary" type="button">Se connecter</button>
      </form>
    </div>
  </main>
);

export default ClientSpace;
