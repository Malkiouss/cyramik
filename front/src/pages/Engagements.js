const Engagements = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Nos engagements</span>
      <h1>Nos engagements</h1>
      <p>Nous privilegions les fournisseurs responsables, les petites series, la reparation et les matieres choisies avec soin.</p>
    </section>
    <div className="values-grid">
      {['Cafe trace', 'Argiles raisonnees', 'Zero gaspillage creatif', 'Accueil inclusif'].map((value) => (
        <article key={value}><h3>{value}</h3><p>Chaque decision cherche l equilibre entre exigence, plaisir et impact juste.</p></article>
      ))}
    </div>
  </main>
);

export default Engagements;
