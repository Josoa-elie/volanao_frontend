import { useCallback, useState, useEffect } from 'react';
import { DollarSign, MoreVertical, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { budgetsApi } from '../api/budgets';
import { formatCurrency, formatMonth, getCurrentMonth, getFirstDayOfMonth } from '../utils/format';
import Modal from '../components/Modal';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ amount: '', month: getCurrentMonth() });
  const [saving, setSaving] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await budgetsApi.list();
      setBudgets(Array.isArray(data) ? data : data.results || []);
    } catch {
      setError('Erreur lors du chargement des budgets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is intentional for this page-level data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBudgets();
  }, [fetchBudgets]);

  const openCreate = () => {
    setEditing(null);
    setForm({ amount: '', month: getCurrentMonth() });
    setIsModalOpen(true);
  };

  const openEdit = (budget) => {
    setEditing(budget);
    setForm({
      amount: budget.amount,
      month: budget.month.slice(0, 7), // "2026-09"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        amount: form.amount,
        month: getFirstDayOfMonth(form.month),
      };

      const currentMonth = form.month || getCurrentMonth();
      const alreadyExists = budgets.some(
        (budget) =>
          budget.month.slice(0, 7) === currentMonth &&
          (!editing || budget.id !== editing.id)
      );

      if (!editing && alreadyExists) {
        setError('Un budget existe déjà pour le mois en cours. Vous ne pouvez pas en ajouter un second.');
        return;
      }

      if (editing) {
        await budgetsApi.update(editing.id, payload);
      } else {
        await budgetsApi.create(payload);
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.non_field_errors?.[0] ||
        data?.month?.[0] ||
        data?.amount?.[0] ||
        'Erreur lors de la sauvegarde.';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce budget ?')) return;
    try {
      await budgetsApi.delete(id);
      fetchBudgets();
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" aria-hidden="true" />
            Budgets mensuels
          </h1>
          <p className="text-base-content/70">Définis ton salaire/revenu pour chaque mois</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau budget
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
      ) : budgets.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <Wallet className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
            <h2 className="card-title justify-center">Aucun budget défini</h2>
            <p className="text-base-content/70">
              Commence par définir ton salaire du mois en cours.
            </p>
            <button className="btn btn-primary mx-auto mt-4" onClick={openCreate}>
              Définir mon premier budget
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {formatMonth(budget.month)}
                    </h3>
                    <p className="text-3xl font-bold text-primary mt-2">
                      {formatCurrency(budget.amount)}
                    </p>
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
                        <button onClick={() => openEdit(budget)}>
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Modifier
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="text-error"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Supprimer
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Modifier le budget' : 'Nouveau budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Mois</span>
            </label>
            <input
              type="month"
              className="input input-bordered w-full"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Salaire / revenu (Ar)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="2000.00"
              required
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
