import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import ResourceFormPage from './pages/ResourceFormPage';
import ResourceListPage from './pages/ResourceListPage';
import { resources } from './config/resources';
import { loadDashboardData, resourceService } from './services/dataService';

const emptyData = { estudiantes: [], grados: [], llegadasTardes: [] };
const CURRENT_YEAR = new Date().getFullYear();

function getPageTitle(view) {
  if (view === 'inicio') return 'Inicio';
  const [key, mode] = view.split('-');
  const resource = resources[key];
  return mode === 'list' ? resource?.plural : `Administrar ${resource?.plural?.toLowerCase() || ''}`;
}

export default function App() {
  const [activeView, setActiveView] = useState('inicio');
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [busyResource, setBusyResource] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const freshData = await loadDashboardData();
      setData(freshData);
      setConnected(true);
      return true;
    } catch {
      setConnected(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadDashboardData()
      .then((freshData) => {
        if (!active) return;
        setData(freshData);
        setConnected(true);
      })
      .catch(() => {
        if (active) setConnected(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const navigate = (view) => {
    setActiveView(view);
    setEditingRecord(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveRecord = async (resource, payload, id) => {
    setBusyResource(resource.key);
    try {
      if (id) await resourceService.update(resource.endpoint, id, payload);
      else await resourceService.create(resource.endpoint, payload);
      await refreshData();
      notify(id ? `${resource.singular} actualizado correctamente.` : `${resource.singular} agregado correctamente.`);
      setEditingRecord(null);
      return true;
    } catch (error) {
      notify(error.message || 'No se pudo guardar el registro.', 'error');
      return false;
    } finally {
      setBusyResource(null);
    }
  };

  const deleteRecord = async (resource, id, alreadyConfirmed = false) => {
    if (!alreadyConfirmed && !window.confirm(`¿Eliminar el registro seleccionado de ${resource.plural.toLowerCase()}?`)) return;
    setBusyResource(resource.key);
    try {
      await resourceService.remove(resource.endpoint, id);
      await refreshData();
      notify(`${resource.singular} eliminado correctamente.`);
      setEditingRecord(null);
    } catch (error) {
      notify(error.message || 'No se pudo eliminar el registro.', 'error');
    } finally {
      setBusyResource(null);
    }
  };

  const openEdit = (resource, record) => {
    setEditingRecord(record);
    setActiveView(`${resource.key}-form`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createNew = (resource) => {
    setEditingRecord(null);
    setActiveView(`${resource.key}-form`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewResource = activeView.split('-')[0];
  const resource = resources[viewResource];
  const mode = activeView.split('-')[1];

  return (
    <div className="app-shell min-h-screen flex">
      <Sidebar activeView={activeView} onNavigate={navigate} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="main-area flex min-w-0 flex-1">
        <header className="topbar">
          <button className="mobile-menu-button" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>La Pulida</span><Icon name="chevron" size={14} /><strong>{getPageTitle(activeView)}</strong></div>
          <div className="topbar-right"><span className={`api-indicator ${connected ? 'api-indicator-on' : ''}`}><i />{connected ? 'API en línea' : 'Conectando'}</span><span className="topbar-avatar">LP</span></div>
        </header>

        <div className="workspace">
          {activeView === 'inicio' && <DashboardPage data={data} onNavigate={navigate} connected={connected} onRefresh={refreshData} loading={loading} />}
          {resource && mode === 'form' && <ResourceFormPage key={`${resource.key}-${editingRecord?.[resource.idField] ?? 'new'}`} resource={resource} records={data[resource.key]} relatedData={data} initialRecord={editingRecord} busy={busyResource === resource.key} onSave={saveRecord} onDelete={deleteRecord} onNotify={notify} />}
          {resource && mode === 'list' && <ResourceListPage resource={resource} records={data[resource.key]} onEdit={(record) => openEdit(resource, record)} onDelete={(item) => deleteRecord(resource, item[resource.idField])} onCreate={() => createNew(resource)} />}
        </div>
        <footer className="app-footer"><span>© {CURRENT_YEAR} Colegio La Pulida S.A.</span><span>Gestión de llegadas tardías</span></footer>
      </main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
