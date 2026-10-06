import { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Car,
  ChartNoAxesCombined,
  CheckCircle2,
  Clapperboard,
  ClipboardList,
  Coffee,
  DollarSign,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Lightbulb,
  PawPrint,
  Plane,
  Plus,
  ReceiptText,
  Shirt,
  Smartphone,
  Tag,
  Target,
  Utensils,
  Wallet,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatMonth, getCurrentMonth } from '../utils/format';

const ICONS = {
  car: Car,
  clapperboard: Clapperboard,
  coffee: Coffee,
  dumbbell: Dumbbell,
  gift: Gift,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  home: Home,
  lightbulb: Lightbulb,
  'paw-print': PawPrint,
  plane: Plane,
  shirt: Shirt,
  smartphone: Smartphone,
  tag: Tag,
  utensils: Utensils,
  wallet: Wallet,
};

const LEGACY_ICON_MAP = {
  '\u{1F354}': 'utensils',
  '\u{1F697}': 'car',
  '\u{1F3E0}': 'home',
  '\u{1F3AC}': 'clapperboard',
  '\u{1F3E5}': 'heart-pulse',
  '\u{1F455}': 'shirt',
  '\u{1F4DA}': 'graduation-cap',
  '\u2708\uFE0F': 'plane',
  '\u{1F381}': 'gift',
  '\u{1F4B0}': 'wallet',
  '\u2615': 'coffee',
  '\u{1F43E}': 'paw-print',
  '\u{1F4A1}': 'lightbulb',
  '\u{1F4F1}': 'smartphone',
  '\u{1F3B5}': 'dumbbell',
  '\u26BD': 'dumbbell',
  '\u{1F3F7}\uFE0F': 'tag',
};

const normalizeIcon = (icon) => LEGACY_ICON_MAP[icon] || icon || 'tag';

const CategoryIcon = ({ name, className = 'h-5 w-5' }) => {
  const Icon = ICONS[normalizeIcon(name)] || Tag;
  return <Icon className={className} aria-hidden="true" />;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [month, setMonth] = useState(getCurrentMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await dashboardApi.get(month);
      setData(result);
    } catch {
      setError('Erreur lors du chargement du dashboard.');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    // Fetching on mount/month changes is intentional for this page-level data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  const categoriesWithLimit = (data?.categories || []).filter((c) => c.monthly_limit);
  const categoriesWithoutLimit = (data?.categories || []).filter((c) => !c.monthly_limit);
  const spentPercentage = data?.spent_percentage || 0;

  // Couleur de la barre globale
  const globalProgressColor =
    spentPercentage > 100
      ? 'progress-error'
      : spentPercentage > 80
      ? 'progress-warning'
      : 'progress-success';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="text-sm text-base-content/70 mb-1">
            Bonjour, {user?.username || user?.name || 'Utilisateur'}
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ChartNoAxesCombined className="h-8 w-8 text-primary" aria-hidden="true" />
            Dashboard
          </h1>
          <p className="text-base-content/70 capitalize">{formatMonth(data?.month)}</p>
        </div>
        <input
          type="month"
          className="input input-bordered"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {/* Si pas de budget */}
      {!data?.has_budget && (
        <div className="alert alert-warning">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          <span>Aucun budget défini pour ce mois.</span>
          <Link to="/budgets" className="btn btn-sm btn-warning">
            Définir un budget
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-box shadow-xl">
          <div className="stat-title flex items-center gap-2">
            <DollarSign className="h-4 w-4" aria-hidden="true" />
            Salaire
          </div>
          <div className="stat-value text-success text-2xl">
            {formatCurrency(data?.income || 0)}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow-xl">
          <div className="stat-title flex items-center gap-2">
            <ReceiptText className="h-4 w-4" aria-hidden="true" />
            Dépenses
          </div>
          <div className="stat-value text-error text-2xl">
            {formatCurrency(data?.total_spent || 0)}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow-xl">
          <div className="stat-title flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Reste à vivre
          </div>
          <div
            className={`stat-value text-2xl ${
              parseFloat(data?.remaining || 0) < 0 ? 'text-error' : 'text-primary'
            }`}
          >
            {formatCurrency(data?.remaining || 0)}
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      {data?.has_budget && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <h2 className="card-title text-lg">Progression du mois</h2>
              <span className="text-2xl font-bold">{spentPercentage}%</span>
            </div>
            <progress
              className={`progress ${globalProgressColor} w-full h-4`}
              value={Math.min(spentPercentage, 100)}
              max="100"
            ></progress>
            <p className="text-sm text-base-content/70 mt-2">
              {formatCurrency(data.total_spent)} dépensés sur {formatCurrency(data.income)}
            </p>
          </div>
        </div>
      )}

      {/* Catégories avec limite */}
      {categoriesWithLimit.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" aria-hidden="true" />
            Catégories avec limite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoriesWithLimit.map((cat) => {
              const spent = cat.total_spent || 0;
              const limit = parseFloat(cat.monthly_limit);
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const color =
                pct > 100 ? 'error' : pct > 80 ? 'warning' : 'success';

              return (
                <div key={cat.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{
                          backgroundColor: `${cat.color}30`,
                          border: `2px solid ${cat.color}`,
                        }}
                      >
                        <CategoryIcon name={cat.icon} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{cat.name}</h3>
                        <p className="text-xs text-base-content/60">
                          {formatCurrency(spent)} / {formatCurrency(limit)}
                        </p>
                      </div>
                      <span className={`text-${color} font-bold text-lg`}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <progress
                      className={`progress progress-${color} w-full`}
                      value={Math.min(spent, limit)}
                      max={limit}
                    ></progress>
                    {spent > limit && (
                      <p className="text-error text-sm mt-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        Dépassement de {formatCurrency(spent - limit)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Catégories sans limite */}
      {categoriesWithoutLimit.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
            Autres catégories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categoriesWithoutLimit.map((cat) => (
              <div key={cat.id} className="stat bg-base-100 rounded-box shadow">
                <div className="stat-figure">
                  <CategoryIcon name={cat.icon} className="h-6 w-6" />
                </div>
                <div className="stat-title text-xs">{cat.name}</div>
                <div className="stat-value text-lg">
                  {formatCurrency(cat.total_spent || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/expenses" className="btn btn-primary gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter une dépense
        </Link>
        <Link to="/categories" className="btn btn-outline gap-2">
          <Tag className="h-4 w-4" aria-hidden="true" />
          Gérer les catégories
        </Link>
      </div>
    </div>
  );
}
