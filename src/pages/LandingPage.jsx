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
              Expense Tracker vous aide à organiser vos achats, suivre vos catégories et garder un œil sur
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
