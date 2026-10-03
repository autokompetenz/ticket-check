import { useState, useCallback } from 'react';
import { verifyTicket } from './api';
import type { TicketInfo, TicketType, VerificationStatus, VerifyRequest } from './types';

const TICKET_TYPES: { value: TicketType; label: string }[] = [
  { value: 'transcash', label: 'Transcash' },
  { value: 'pcs', label: 'PCS' },
  { value: 'itunes', label: 'iTunes' },
  { value: 'neosurf', label: 'Neosurf' },
  { value: 'steam', label: 'Steam' },
  { value: 'cryptonow', label: 'CryptoNow' },
];

const TICKET_LABELS: Record<TicketType, string> = {
  transcash: 'Transcash',
  pcs: 'PCS',
  itunes: 'iTunes',
  neosurf: 'Neosurf',
  steam: 'Steam',
  cryptonow: 'CryptoNow',
};

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; title: string; sub: string }
> = {
  pending: {
    label: 'En cours',
    title: 'Vérification en cours',
    sub: 'Votre ticket est en cours d’analyse',
  },
  valid: { label: 'Valide', title: 'Ticket valide', sub: 'Coupon authentifié avec succès' },
  used: { label: 'Utilisé', title: 'Déjà utilisé', sub: 'Ce coupon a déjà été utilisé' },
  invalid: { label: 'Invalide', title: 'Ticket invalide', sub: 'Ce coupon n’est pas reconnu' },
  expired: { label: 'Expiré', title: 'Ticket expiré', sub: 'La validité de ce coupon est dépassée' },
};

function StatusIcon({ status }: { status: VerificationStatus | 'error' }) {
  if (status === 'valid') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (status === 'used') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  if (status === 'pending' || status === 'expired') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export default function Home() {
  const [form, setForm] = useState<VerifyRequest>({
    code: '',
    type: 'transcash',
    firstName: '',
    lastName: '',
    amount: 0,
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TicketInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback((field: keyof VerifyRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || form.amount <= 0) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await verifyTicket(form);
      if (response.success && response.ticket) {
        setResult(response.ticket);
      } else {
        setError(response.error || 'Une erreur est survenue lors de la vérification.');
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  const handleReset = useCallback(() => {
    setForm({ code: '', type: 'transcash', firstName: '', lastName: '', amount: 0, email: '' });
    setResult(null);
    setError(null);
  }, []);

  const isFormValid = Boolean(
    form.code.trim() && form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.amount > 0
  );

  return (
    <div className="app">
      <div className="orb a" />
      <div className="orb b" />
      <div className="orb c" />
      <div className="grid-bg" />

      <header className="header">
        <div className="wrap">
          <div className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4 4 10-10" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="logo-text">Ticket<b>Check</b></span>
          </div>
          <nav className="top">
            <a href="#verify">Vérifier</a>
            <a href="#how">Comment ça marche</a>
            <a href="#security">Sécurité</a>
          </nav>
          <a className="head-cta" href="#verify">Vérifier un code</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />Système de vérification sécurisé</span>
            <h1>Vérifiez votre <span className="g">coupon</span> en quelques secondes</h1>
            <p className="lead">
              Contrôlez l'authenticité de vos tickets Transcash, PCS, Neosurf, iTunes, Steam et CryptoNow
              avant de les utiliser. Rapide, sécurisé et 100&nbsp;% confidentiel.
            </p>
            <div className="trust">
              <span className="chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /></svg>
                Chiffrement SSL 256-bit
              </span>
              <span className="chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg>
                Vérification instantanée
              </span>
              <span className="chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                Disponible 24/7
              </span>
            </div>
          </div>
        </section>

        <section className="verify" id="verify">
          <div className="wrap">
            <div className="panel">
              <div className="steps">
                <div className="step on"><div className="bar" /><span>1 · Ticket</span></div>
                <div className="step on"><div className="bar" /><span>2 · Infos</span></div>
                <div className="step"><div className="bar" /><span>3 · Résultat</span></div>
              </div>

              <div className="panel-head">
                <h2>Vérifier un code</h2>
                <p>Remplissez le formulaire pour contrôler votre ticket en temps réel</p>
              </div>

              <form onSubmit={handleSubmit} className="form">
                <div className="field">
                  <label>Type de ticket</label>
                  <select
                    value={form.type}
                    onChange={(e) => update('type', e.target.value as TicketType)}
                    disabled={loading}
                  >
                    {TICKET_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="field">
                    <label>Prénom</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      placeholder="Jean"
                      disabled={loading}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="field">
                    <label>Nom</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      placeholder="Dupont"
                      disabled={loading}
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label>Montant (€)</label>
                    <input
                      type="number"
                      value={form.amount || ''}
                      onChange={(e) => update('amount', Number(e.target.value))}
                      placeholder="50"
                      min="1"
                      disabled={loading}
                    />
                  </div>
                  <div className="field">
                    <label>Adresse email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="jean@exemple.com"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="field code">
                  <label>Code du ticket</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => update('code', e.target.value)}
                    placeholder="1234 5678 9012"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck={false}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="btn" disabled={loading || !isFormValid}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Vérification en cours...
                    </>
                  ) : (
                    <>
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                      </svg>
                      Vérifier le code
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="result status-error">
                  <div className="result-head">
                    <div className="result-ico"><StatusIcon status="error" /></div>
                    <div className="rh-text">
                      <h3>Erreur de vérification</h3>
                      <div className="sub">Une erreur est survenue</div>
                      <span className="badge">Échec</span>
                    </div>
                  </div>
                  <div className="result-grid">
                    <div className="cell full"><span className="k">Détail</span><span className="v">{error}</span></div>
                  </div>
                  <div className="result-foot">
                    <button type="button" className="btn-ghost" onClick={handleReset}>Réessayer</button>
                  </div>
                </div>
              )}

              {result && (
                <div className={`result status-${result.status}`}>
                  <div className="result-head">
                    <div className="result-ico"><StatusIcon status={result.status} /></div>
                    <div className="rh-text">
                      <h3>{STATUS_CONFIG[result.status].title}</h3>
                      <div className="sub">{STATUS_CONFIG[result.status].sub}</div>
                      <span className="badge">{STATUS_CONFIG[result.status].label}</span>
                    </div>
                  </div>

                  <div className="result-grid">
                    <div className="cell">
                      <span className="k">Type de ticket</span>
                      <span className="v">{TICKET_LABELS[result.type]}</span>
                    </div>
                    <div className="cell amount">
                      <span className="k">Montant</span>
                      <span className="v">{result.amount} &euro;</span>
                    </div>
                    <div className="cell full">
                      <span className="k">Code du ticket</span>
                      <span className="v mono">{result.code}</span>
                    </div>
                    {result.status === 'used' && result.lastUsed && (
                      <div className="cell full">
                        <span className="k">Dernière utilisation</span>
                        <span className="v">{result.lastUsed}</span>
                      </div>
                    )}
                  </div>

                  {result.status === 'pending' && (
                    <p className="note">
                      Votre ticket est en cours de vérification. Le résultat vous sera communiqué
                      par email dès que l'analyse sera terminée.
                    </p>
                  )}

                  <div className="result-foot">
                    <button type="button" className="btn-ghost" onClick={handleReset}>
                      Vérifier un autre code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section" id="how" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow"><span className="dot" />Simple &amp; rapide</span>
              <h2>Comment ça marche&nbsp;?</h2>
              <p>Trois étapes seulement pour connaître le statut de votre coupon.</p>
            </div>
            <div className="cards">
              <div className="card">
                <div className="n">1</div>
                <h3>Remplissez le formulaire</h3>
                <p>Sélectionnez le type de ticket et saisissez vos informations personnelles.</p>
              </div>
              <div className="card">
                <div className="n">2</div>
                <h3>Vérification instantanée</h3>
                <p>Notre système analyse votre code en temps réel et contrôle son authenticité.</p>
              </div>
              <div className="card">
                <div className="n">3</div>
                <h3>Résultat garanti</h3>
                <p>Recevez immédiatement le statut de votre coupon : valide, utilisé ou expiré.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="stats">
              <div className="stat"><div className="big">99,9 %</div><div className="lbl">Taux de disponibilité</div></div>
              <div className="stat"><div className="big">&lt; 2 s</div><div className="lbl">Temps de vérification</div></div>
              <div className="stat"><div className="big">6</div><div className="lbl">Types de coupons supportés</div></div>
            </div>
          </div>
        </section>

        <section className="section" id="security" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="security">
              <div className="shield">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h2>Vos données sont protégées</h2>
              <p>
                TicketCheck utilise un chiffrement SSL 256-bit pour garantir la sécurité de vos données.
                Vos informations ne sont jamais partagées avec des tiers.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="logo">
                <div className="logo-mark">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4 4 10-10" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="logo-text">TicketCheck</span>
              </div>
              <p className="foot-desc">Service de vérification de coupons prépayés. Rapide, fiable et sécurisé.</p>
            </div>
            <div className="foot-col">
              <h4>Services</h4>
              <a href="#verify">Vérifier un code</a>
              <a href="#how">Comment ça marche</a>
              <a href="#security">Sécurité</a>
            </div>
            <div className="foot-col">
              <h4>Légal</h4>
              <a href="#mentions">Mentions légales</a>
              <a href="#privacy">Confidentialité</a>
              <a href="#cgv">CGV</a>
            </div>
          </div>
          <div className="foot-bottom">&copy; 2026 TicketCheck. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
