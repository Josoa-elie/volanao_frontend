import { useCallback, useState, useEffect } from 'react';
import {
  Car,
  Clapperboard,
  Coffee,
  Dumbbell,
  Fuel,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Lightbulb,
  MoreVertical,
  PawPrint,
  Pencil,
  Plane,
  Plus,
  Shirt,
  Smartphone,
  Tag,
  Trash2,
  Trash2Icon,
  Utensils,
  Wallet,
} from 'lucide-react';
import { categoriesApi } from '../api/categories';
import { formatCurrency } from '../utils/format';
import Modal from '../components/Modal';

const ICON_OPTIONS = [
  { value: 'utensils', Icon: Utensils, label: 'Nourriture' },
  { value: 'car', Icon: Car, label: 'Transport' },
  { value: 'home', Icon: Home, label: 'Logement' },
  { value: 'clapperboard', Icon: Clapperboard, label: 'Loisirs' },
  { value: 'heart-pulse', Icon: HeartPulse, label: 'Santé' },
  { value: 'shirt', Icon: Shirt, label: 'Vêtements' },
  { value: 'graduation-cap', Icon: GraduationCap, label: 'Études' },
  { value: 'plane', Icon: Plane, label: 'Voyage' },
  { value: 'gift', Icon: Gift, label: 'Cadeaux' },
  { value: 'wallet', Icon: Wallet, label: 'Argent' },
  { value: 'coffee', Icon: Coffee, label: 'Café' },
  { value: 'paw-print', Icon: PawPrint, label: 'Animaux' },
  { value: 'lightbulb', Icon: Lightbulb, label: 'Énergie' },
  { value: 'smartphone', Icon: Smartphone, label: 'Téléphone' },
  { value: 'dumbbell', Icon: Dumbbell, label: 'Sport' },
  {value: 'fuel', Icon: Fuel, label: 'Carburant'}
];

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

const ICONS = Object.fromEntries([
  ...ICON_OPTIONS.map(({ value, Icon }) => [value, Icon]),
  ['tag', Tag],
]);

const DEFAULT_ICON = 'tag';
// const COLOR_OPTIONS = ['#FF5733', '#3498DB', '#9B59B6', '#2ECC71', '#F39C12', '#E74C3C', '#1ABC9C', '#34495E', '#95A5A6', '#E91E63'];

const normalizeIcon = (icon) => LEGACY_ICON_MAP[icon] || icon || DEFAULT_ICON;

const CategoryIcon = ({ name, className = 'h-5 w-5' }) => {
  const Icon = ICONS[normalizeIcon(name)] || Tag;
  return <Icon className={className} aria-hidden="true" />;
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    icon: DEFAULT_ICON,
    color: '#3498DB',
    monthly_limit: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.list();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch {
      setError('Erreur lors du chargement des catégories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is intentional for this page-level data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', icon: DEFAULT_ICON, color: '#3498DB', monthly_limit: '' });
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      icon: normalizeIcon(cat.icon),
      color: cat.color || '#3498DB',
      monthly_limit: cat.monthly_limit || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        icon: form.icon,
        color: form.color,
        monthly_limit: form.monthly_limit || null,
      };

      if (editing) {
        await categoriesApi.update(editing.id, payload);
      } else {
        await categoriesApi.create(payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.non_field_errors?.[0] ||
        data?.name?.[0] ||
        data?.monthly_limit?.[0] ||
        'Erreur lors de la sauvegarde.';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ? Les dépenses liées bloqueront la suppression.')) return;
    try {
      await categoriesApi.delete(id);
      fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Impossible de supprimer : cette catégorie contient des dépenses.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="h-8 w-8 text-primary" aria-hidden="true" />
            Catégories
          </h1>
          <p className="text-base-content/70">Organise tes dépenses par catégorie</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle catégorie
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : categories.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <Tag className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
            <h2 className="card-title justify-center">Aucune catégorie</h2>
            <p className="text-base-content/70">
              Crée ta première catégorie pour commencer à tracker tes dépenses.
            </p>
            <button className="btn btn-primary mx-auto mt-4" onClick={openCreate}>
              Créer ma première catégorie
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${cat.color}30`, border: `2px solid ${cat.color}` }}
                    >
                      <CategoryIcon name={cat.icon} className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{cat.name}</h3>
                      {cat.monthly_limit && (
                        <p className="text-sm text-base-content/70">
                          Limite : {formatCurrency(cat.monthly_limit)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-40 p-2"
                    >
                      <li>
                        <button onClick={() => openEdit(cat)}>
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Modifier
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-error"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Supprimer
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {cat.monthly_limit && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dépensé ce mois</span>
                      <span className="font-medium">
                        {formatCurrency(cat.total_spent || 0)} / {formatCurrency(cat.monthly_limit)}
                      </span>
                    </div>
                    <progress
                      className={`progress ${
                        (cat.total_spent || 0) > cat.monthly_limit
                          ? 'progress-error'
                          : (cat.total_spent || 0) / cat.monthly_limit > 0.8
                          ? 'progress-warning'
                          : 'progress-success'
                      } w-full`}
                      value={cat.total_spent || 0}
                      max={cat.monthly_limit}
                    ></progress>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nom</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nourriture"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Icône</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(({ value, Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm ${
                    form.icon === value ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setForm({ ...form, icon: value })}
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>


          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Limite mensuelle (optionnel)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              value={form.monthly_limit}
              onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })}
              placeholder="Laisser vide pour pas de limite"
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : editing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
