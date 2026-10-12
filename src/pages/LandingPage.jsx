import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  PiggyBank,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

const features = [
  {
    icon: <Wallet size={20} />,
    title: 'Suivi simple',
    description:
      'Enregistrez chaque dépense et gardez une vue claire de votre budget au quotidien.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Visualisez vos habitudes',
    description:
      'Analysez vos dépenses par catégorie pour repérer rapidement où votre argent va.',
  },
  {
    icon: <PiggyBank size={20} />,
    title: 'Budget maîtrisé',
    description:
      'Fixez des limites par catégorie et restez informé de votre progression.',
  },
];

const steps = [
  'Créez votre compte en quelques secondes.',
  'Ajoutez vos catégories et vos budgets.',
  'Suivez vos dépenses et ajustez vos objectifs.',
];

const schemaTables = [
  {
    name: 'users',
    fields: ['id (PK)', 'username', 'email', 'password'],
    description: 'Le compte utilisateur principal.',
  },
  {
    name: 'categories',
    fields: ['id (PK)', 'name', 'icon', 'color', 'monthly_limit', 'user_id (FK)'],
    description: 'Chaque catégorie appartient à un utilisateur.',
  },
  {
    name: 'budgets',
    fields: ['id (PK)', 'amount', 'month', 'user_id (FK)'],
    description: 'Le budget mensuel défini par utilisateur.',
  },
  {
    name: 'expenses',
    fields: ['id (PK)', 'amount', 'description', 'date', 'user_id (FK)', 'category_id (FK)'],
    description: 'Une dépense est liée à un utilisateur et à une catégorie.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="sticky top-0 z-40 border-b border-base-300/80 bg-base-200/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/20">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">Volanao</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
              Se connecter
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm sm:btn-md">
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="badge badge-primary badge-outline px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em]">
              Gestion financière simple
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-base-content sm:text-5xl lg:text-6xl">
              Prenez le contrôle de vos dépenses, sans stress.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-base-content/70">
              Volanao vous aide à organiser vos achats, suivre vos catégories et garder un œil sur
              vos budgets, afin d’atteindre vos objectifs financiers plus facilement.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn btn-primary btn-lg gap-2">
                Commencer gratuitement
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                J’ai déjà un compte
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-base-content/70">
              <ShieldCheck className="text-success" size={18} />
              Simple, clair et pensé pour une gestion quotidienne efficace.
            </div>
          </div>

          <div className="relative">
            <div className="card bg-base-100 shadow-2xl shadow-primary/10 ring-1 ring-base-300">
              <div className="card-body p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/60">Budget du mois</p>
                    <h2 className="mt-1 text-3xl font-bold">1 240 000 Ar</h2>
                  </div>
                  <div className="badge badge-success badge-outline">+12%</div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { name: 'Alimentation', value: '320 000 Ar', percent: '72%' },
                    { name: 'Transport', value: '185 000 Ar', percent: '58%' },
                    { name: 'Loisirs', value: '140 000 Ar', percent: '40%' },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-base-content/70">{item.value}</span>
                      </div>
                      <progress className="progress progress-primary" value={item.percent} max="100"></progress>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-base-200 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-base-content/60">Résumé</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base-content/70">Dépenses restantes</span>
                    <span className="text-lg font-bold text-success">540 000 Ar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pourquoi l’utiliser ?</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Tout ce qu’il faut pour mieux gérer vos finances</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon, title, description }) => (
              <div key={title} className="card bg-base-100 shadow-lg ring-1 ring-base-300">
                <div className="card-body">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {icon}
                  </div>
                  <h3 className="card-title text-xl">{title}</h3>
                  <p className="mt-2 text-base-content/70">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Structure de la base de données</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Modélisation en SGBDR</h2>
          </div>

          <div className="mb-8 rounded-3xl bg-base-100 p-5 shadow-lg ring-1 ring-base-300 sm:p-6">
            <p className="text-base text-base-content/80">
              Dans un SGBDR, chaque table représente une entité métier. Les clés primaires <strong>PK</strong> identifient les lignes,
              tandis que les clés étrangères <strong>FK</strong> relient les tables entre elles. Ici, un utilisateur possède plusieurs
              catégories, plusieurs budgets et plusieurs dépenses.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {schemaTables.map((table) => (
              <div key={table.name} className="card bg-base-100 shadow-lg ring-1 ring-base-300">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-bold text-primary">{table.name}</h3>
                  <p className="text-sm text-base-content/70">{table.description}</p>
                  <ul className="mt-3 space-y-1 text-sm text-base-content/80">
                    {table.fields.map((field) => (
                      <li key={field} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="m-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Structure de la base de données</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Relations entre les tables</h2>
          </div>

          <div className="rounded-3xl bg-base-100 p-5 shadow-lg ring-1 ring-base-300 sm:p-6">
            <p className="mb-4 text-base text-base-content/80">
              La table <strong>users</strong> est au centre du schéma. Un utilisateur peut créer plusieurs catégories,
              plusieurs budgets mensuels et plusieurs dépenses. On dit alors qu’il existe une relation de type <strong>un à plusieurs</strong>.
            </p>

            <p className="mb-4 text-base text-base-content/80">
              La table <strong>categories</strong> est liée à <strong>users</strong> grâce à la clé étrangère <strong>user_id</strong>.
              Cela signifie qu’une catégorie appartient à un seul utilisateur, mais qu’un utilisateur peut avoir plusieurs catégories.
              De la même manière, chaque budget est associé à un utilisateur pour un mois donné.
            </p>

            <p className="mb-4 text-base text-base-content/80">
              La table <strong>expenses</strong> est la plus importante pour les opérations courantes. Une dépense appartient à un
              utilisateur et à une catégorie précise. C’est pour cette raison qu’elle contient deux clés étrangères : <strong>user_id</strong>
              et <strong>category_id</strong>. Grâce à ces relations, on sait exactement à quel utilisateur appartient la dépense et dans
              quelle catégorie elle a été classée.
            </p>

            <p className="text-base text-base-content/80">
              En résumé, le système est relationnel : un utilisateur possède plusieurs catégories et plusieurs dépenses, chaque dépense
              est classée dans une catégorie, et chaque budget est lié à un mois précis pour ce même utilisateur. Cette logique permet de
              regrouper les données proprement et de faire des calculs fiables comme le total dépensé par mois ou par catégorie.
            </p>
          </div>
          <div className="mt-8 rounded-3xl bg-base-100 p-5 shadow-lg ring-1 ring-base-300 sm:p-6">
            
            <div className="mt-6 rounded-2xl bg-base-200 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Exemple logique</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm text-base-content">
                {`SELECT *
                FROM expenses e
                JOIN categories c ON c.id = e.category_id
                JOIN users u ON u.id = e.user_id
                WHERE u.id = 1;`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-primary text-primary-content p-6 shadow-2xl shadow-primary/20 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-content/80">Comment ça marche</p>
              <h3 className="mt-3 text-3xl font-bold">Un outil pensé pour une utilisation rapide et efficace.</h3>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-primary-content">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-base-100 px-4 py-3 shadow-sm ring-1 ring-base-300">
            <CheckCircle2 className="text-success" size={18} />
            <span className="font-medium">Commencez dès maintenant et prenez mieux en main votre argent.</span>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn btn-primary btn-lg">
              Créer mon compte
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Me connecter
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
