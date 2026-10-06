import { useCallback, useState, useEffect } from 'react';
import {
  Car,
  Clapperboard,
  Coffee,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Lightbulb,
  PawPrint,
  Pencil,
  Plane,
  Plus,
  ReceiptText,
  Shirt,
  Smartphone,
  Tag,
  Trash2,
  Utensils,
  Wallet,
  X,
} from 'lucide-react';
import { expensesApi } from '../api/expenses';
import { categoriesApi } from '../api/categories';
import { formatCurrency, formatDate, getCurrentMonth } from '../utils/format';
import Modal from '../components/Modal';

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

const CategoryIcon = ({ name, className = 'h-4 w-4' }) => {
  const Icon = ICONS[normalizeIcon(name)] || Tag;
  return <Icon className={className} aria-hidden="true" />;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: 'Confirmation',
    message: '',
    payload: null,
  });

  // Filtres
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [filterCategory, setFilterCategory] = useState('');

  // Form
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: today,
    category: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterMonth) filters.month = filterMonth;
      if (filterCategory) filters.category = filterCategory;

      const [expensesData, catsData] = await Promise.all([
        expensesApi.list(filters),
        categoriesApi.list(),
      ]);

      setExpenses(Array.isArray(expensesData) ? expensesData : expensesData.results || []);
      setCategories(Array.isArray(catsData) ? catsData : catsData.results || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterMonth]);

  useEffect(() => {
    // Fetching on mount/filter changes is intentional for this page-level data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const openCreate = () => {
    if (categories.length === 0) {
      setError("Crée d'abord une catégorie avant d'ajouter une dépense.");
      return;
    }
    setEditing(null);
    setForm({
      amount: '',
      description: '',
      date: today,
      category: categories[0].id,
    });
    setIsModalOpen(true);
  };

  // const openEdit = (expense) => {
  //   setEditing(expense);
  //   setForm({
  //     amount: expense.amount,
  //     description: expense.description || '',
  //     date: expense.date,
  //     category: expense.category,
  //   });
  //   setIsModalOpen(true);
  // };

  const saveExpense = async (payload) => {
    setSaving(true);

    try {
      if (editing) {
        await expensesApi.update(editing.id, payload);
      } else {
        await expensesApi.create(payload);
      }
      setIsModalOpen(false);
      setConfirmDialog({ isOpen: false, title: 'Confirmation', message: '', payload: null });
      void fetchData();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.non_field_errors?.[0] ||
        data?.category?.[0] ||
        data?.amount?.[0] ||
        data?.date?.[0] ||
        data?.detail ||
        'Erreur lors de la sauvegarde.';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const selectedCategory = categories.find(
      (category) => Number(category.id) === Number(form.category)
    );
    const newAmount = Number(form.amount || 0);

    const payload = {
      amount: form.amount,
      description: form.description,
      date: form.date,
      category: parseInt(form.category),
    };

    if (selectedCategory?.monthly_limit) {
      const monthlyLimit = Number(selectedCategory.monthly_limit);
      const currentSpent = Number(selectedCategory.total_spent || 0);
      const originalAmount =
        editing && Number(editing.category) === Number(selectedCategory.id)
          ? Number(editing.amount || 0)
          : 0;
      const projectedSpent = currentSpent - originalAmount + newAmount;

      if (projectedSpent > monthlyLimit) {
        setConfirmDialog({
          isOpen: true,
          title: 'Limite de catégorie dépassée',
          message: `Le montant de cette dépense dépasse la limite mensuelle de la catégorie "${selectedCategory.name}" (${formatCurrency(monthlyLimit)}). Voulez-vous vraiment l'enregistrer ?`,
          payload,
        });
        return;
      }
    }

    await saveExpense(payload);
  };

  // const handleDelete = async (id) => {
  //   if (!confirm('Supprimer cette dépense ?')) return;
  //   try {
  //     await expensesApi.delete(id);
  //     void fetchData();
  //   } catch {
  //     setError('Erreur lors de la suppression.');
  //   }
  // };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ReceiptText className="h-8 w-8 text-primary" aria-hidden="true" />
            Dépenses
          </h1>
          <p className="text-base-content/70">
            Total de la période : <span className="font-bold text-primary">{formatCurrency(total)}</span>
          </p>
        </div>
        <button className="btn btn-primary gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle dépense
        </button>
      </div>

      {/* Filtres */}
      <div className="card bg-base-100 shadow">
        <div className="card-body py-4">
          <div className="flex gap-4 flex-wrap">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Mois</span>
              </label>
              <input
                type="month"
                className="input input-bordered input-sm"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Catégorie</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Toutes</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {(filterMonth || filterCategory) && (
              <div className="form-control justify-end">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setFilterMonth('');
                    setFilterCategory('');
                  }}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
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
      ) : expenses.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <ReceiptText className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
            <h2 className="card-title justify-center">Aucune dépense</h2>
            <p className="text-base-content/70">
              Ajoute ta première dépense pour cette période.
            </p>
            <button className="btn btn-primary mx-auto mt-4" onClick={openCreate}>
              Ajouter une dépense
            </button>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Catégorie</th>
                  <th>Description</th>
                  <th className="text-right">Montant</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="whitespace-nowrap">{formatDate(exp.date)}</td>
                    <td>
                      <span
                        className="badge gap-1"
                        style={{
                          backgroundColor: `${exp.category_color || '#999'}20`,
                          borderColor: exp.category_color || '#999',
                          color: 'inherit',
                        }}
                      >
                        <CategoryIcon name={exp.category_icon} />
                        {exp.category_name}
                      </span>
                    </td>
                    <td className="text-base-content/70">{exp.description || '—'}</td>
                    <td className="text-right font-bold text-error">
                      -{formatCurrency(exp.amount)}
                    </td>
                    {/* <td className="text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => openEdit(exp)}
                          aria-label="Modifier"
                          title="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          className="btn btn-xs btn-ghost text-error"
                          onClick={() => handleDelete(exp.id)}
                          aria-label="Supprimer"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3} className="text-right">Total</th>
                  <th className="text-right text-error">{formatCurrency(total)}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Modifier la dépense' : 'Nouvelle dépense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Montant (Ar)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="25.50"
              required
              autoFocus
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Catégorie</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description (optionnel)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Déjeuner au restaurant"
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

      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, title: 'Confirmation', message: '', payload: null })}
        title={confirmDialog.title}
        size="sm"
      >
        <div className="space-y-4">
          <div className="alert alert-warning shadow-sm">
            <span>{confirmDialog.message}</span>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setConfirmDialog({ isOpen: false, title: 'Confirmation', message: '', payload: null })}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={async () => {
                if (!confirmDialog.payload) return;
                await saveExpense(confirmDialog.payload);
              }}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
