import { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  RefreshCw,
  School,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react';
import { api } from './lib/api';

const resources = {
  estudiantes: {
    singular: 'estudiante',
    plural: 'estudiantes',
    title: 'Estudiantes',
    id: 'idEstudiente',
    icon: UsersRound,
    fields: [
      { name: 'nie', label: 'NIE', required: true, maxLength: 30 },
      { name: 'nombre', label: 'Nombre completo', required: true, maxLength: 150 },
      { name: 'responsable', label: 'Responsable', required: true, maxLength: 150 },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true, maxLength: 30 },
    ],
  },
  grados: {
    singular: 'grado',
    plural: 'grados',
    title: 'Grados',
    id: 'idGrado',
    icon: BookOpen,
    fields: [
      { name: 'nombreGrado', label: 'Nombre del grado', required: true, maxLength: 100 },
    ],
  },
  'llegadas-tardes': {
    singular: 'llegada tardía',
    plural: 'llegadas tardías',
    title: 'Llegadas tarde',
    id: 'idLlegadaTarde',
    icon: Clock3,
    fields: [
      { name: 'idEstudiente', label: 'Estudiante', type: 'student', required: true },
      { name: 'idGrado', label: 'Grado', type: 'grade', required: true },
      { name: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'horaLlegadaTardia', label: 'Hora de llegada', type: 'time', required: true },
      { name: 'detalle', label: 'Detalle', type: 'textarea', required: false, maxLength: 1000 },
    ],
  },
};

const menuGroups = [
  { title: 'General', items: [{ id: 'dashboard', label: 'Resumen', icon: LayoutDashboard }] },
  {
    title: 'Formularios',
    items: Object.entries(resources).map(([id, resource]) => ({ id: `form:${id}`, label: resource.title, icon: resource.icon })),
  },
  {
    title: 'Listas',
    items: Object.entries(resources).map(([id, resource]) => ({ id: `list:${id}`, label: resource.title, icon: ClipboardList })),
  },
];

function today() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function nowTime() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function emptyDraft(type) {
  if (type === 'llegadas-tardes') {
    return { idEstudiente: '', idGrado: '', fecha: today(), horaLlegadaTardia: nowTime(), detalle: '' };
  }
  return Object.fromEntries(resources[type].fields.map((field) => [field.name, '']));
}

function draftFromRecord(type, record) {
  return Object.fromEntries(resources[type].fields.map((field) => [
    field.name,
    record[field.name] === null ? '' : String(record[field.name] ?? ''),
  ]));
}

function requestBody(type, draft) {
  if (type === 'llegadas-tardes') {
    return {
      ...draft,
      idEstudiente: Number(draft.idEstudiente),
      idGrado: Number(draft.idGrado),
      detalle: draft.detalle.trim() || null,
    };
  }
  return Object.fromEntries(Object.entries(draft).map(([field, value]) => [field, value.trim()]));
}

function Notice({ notice, dismiss }) {
  if (!notice) return null;
  const success = notice.type === 'success';
  const Icon = success ? Check : CircleAlert;
  return (
    <div
      className={`mb-5 flex items-center gap-3 border px-4 py-3 text-sm ${success ? 'border-[#bfd7a8] bg-[#edf5e6] text-[#36592f]' : 'border-[#e8b6a8] bg-[#fff0eb] text-[#873d30]'}`}
      role="status"
    >
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">{notice.message}</span>
      <button type="button" onClick={dismiss} aria-label="Cerrar aviso" className="p-1 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}

function FormField({ field, value, onChange, students, grades }) {
  const common = {
    id: `field-${field.name}`,
    name: field.name,
    required: field.required,
    maxLength: field.maxLength,
    value,
    onChange: (event) => onChange(field.name, event.target.value),
    className: 'field-control',
  };

  let control;
  if (field.type === 'student' || field.type === 'grade') {
    const options = field.type === 'student' ? students : grades;
    const valueKey = field.type === 'student' ? 'idEstudiente' : 'idGrado';
    control = (
      <select {...common}>
        <option value="">Selecciona {field.type === 'student' ? 'un estudiante' : 'un grado'}</option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {field.type === 'student' ? `${option.nombre} · ${option.nie}` : option.nombreGrado}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = <textarea {...common} rows={3} placeholder="Escribe una nota, si aplica" />;
  } else {
    control = <input {...common} type={field.type || 'text'} />;
  }

  return (
    <label htmlFor={common.id} className="block text-sm font-semibold text-[#40584f]">
      {field.label}{field.required && <span className="ml-1 text-[#b24d3c]">*</span>}
      {control}
    </label>
  );
}

function App() {
  const [screen, setScreen] = useState('dashboard');
  const [records, setRecords] = useState({ estudiantes: [], grados: [], 'llegadas-tardes': [] });
  const [draft, setDraft] = useState(emptyDraft('estudiantes'));
  const [selectedId, setSelectedId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  async function loadRecords() {
    setLoading(true);
    try {
      const [estudiantes, grados, llegadas] = await Promise.all([
        api.list('estudiantes'),
        api.list('grados'),
        api.list('llegadas-tardes'),
      ]);
      setRecords({ estudiantes, grados, 'llegadas-tardes': llegadas });
      setApiOnline(true);
    } catch (error) {
      setApiOnline(false);
      setNotice({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const [screenKind, type] = screen.split(':');
  const isForm = screenKind === 'form';
  const isList = screenKind === 'list';
  const resource = (isForm || isList) ? resources[type] : null;
  const items = resource ? records[type] : [];

  function navigate(screenId) {
    setScreen(screenId);
    setNotice(null);
    if (screenId.startsWith('form:')) {
      const nextType = screenId.split(':')[1];
      setDraft(emptyDraft(nextType));
      setSelectedId('');
      setEditingId(null);
    }
  }

  function startNew() {
    setDraft(emptyDraft(type));
    setSelectedId('');
    setEditingId(null);
    setNotice({ type: 'success', message: `Formulario listo para agregar ${resource.singular}.` });
  }

  function modifySelected() {
    const record = items.find((item) => String(item[resource.id]) === selectedId);
    if (!record) {
      setNotice({ type: 'error', message: `Selecciona un ${resource.singular} de la lista para modificar.` });
      return;
    }
    setDraft(draftFromRecord(type, record));
    setEditingId(String(record[resource.id]));
    setNotice({ type: 'success', message: `${resource.singular} cargado. Cambia los datos y pulsa Guardar.` });
  }

  async function saveRecord(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = requestBody(type, draft);
      const wasEditing = Boolean(editingId);
      if (wasEditing) await api.update(type, editingId, payload);
      else await api.create(type, payload);
      await loadRecords();
      setDraft(emptyDraft(type));
      setSelectedId('');
      setEditingId(null);
      setNotice({ type: 'success', message: `${resource.singular} ${wasEditing ? 'modificado' : 'agregado'} correctamente.` });
    } catch (error) {
      setNotice({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(id = selectedId) {
    if (!id) {
      setNotice({ type: 'error', message: `Selecciona un ${resource.singular} para eliminar.` });
      return;
    }
    if (!window.confirm(`¿Eliminar este registro de ${resource.singular}?`)) return;

    setBusy(true);
    try {
      await api.remove(type, id);
      await loadRecords();
      setDraft(emptyDraft(type));
      setSelectedId('');
      setEditingId(null);
      setNotice({ type: 'success', message: `${resource.singular} eliminado correctamente.` });
    } catch (error) {
      setNotice({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  function openForModification(resourceType, record) {
    const config = resources[resourceType];
    const id = String(record[config.id]);
    setScreen(`form:${resourceType}`);
    setDraft(draftFromRecord(resourceType, record));
    setSelectedId(id);
    setEditingId(id);
    setNotice({ type: 'success', message: `${config.singular} cargado para modificar.` });
  }

  const todayArrivals = records['llegadas-tardes'].filter((arrival) => arrival.fecha === today()).length;

  return (
    <div className="min-h-screen text-[#173b34]">
      <header className="school-hero relative isolate h-[168px] overflow-hidden text-white sm:h-[190px]">
        <div className="relative mx-auto flex h-full max-w-[1600px] items-start justify-between gap-4 px-4 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-white/35 bg-white/10"><School size={21} /></span>
            <div><p className="font-display text-sm font-bold sm:text-base">Colegio La Pulida S.A.</p><p className="mt-0.5 text-[10px] tracking-[0.1em] text-white/75">CONTROL ESCOLAR</p></div>
          </div>
          <div className="inline-flex items-center gap-2 border border-white/30 bg-[#173b34]/55 px-2.5 py-2 text-[11px] backdrop-blur-sm sm:px-3 sm:text-xs" aria-live="polite">
            <span className={`size-2 rounded-full ${apiOnline ? 'bg-[#c8ee68]' : loading ? 'animate-pulse bg-[#ffd06d]' : 'bg-[#ff9b80]'}`} />
            {apiOnline ? 'API conectada' : loading ? 'Conectando' : 'API desconectada'}
          </div>
          <div className="absolute bottom-5 left-4 sm:bottom-6 sm:left-8 lg:left-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d8f19b]">Asistencia y puntualidad</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Gestión de llegadas tardías</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-190px)] w-full min-w-0 max-w-[1600px] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-[#dce5da] bg-[#f8faf6] px-3 py-3 sm:px-5 xl:border-b-0 xl:border-r xl:px-4 xl:py-7">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-1">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-1 px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#88958c] xl:mb-2 xl:px-3">{group.title}</p>
                <nav aria-label={group.title} className="grid grid-cols-2 gap-1 xl:grid-cols-1">
                  {group.items.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      aria-current={screen === id ? 'page' : undefined}
                      onClick={() => navigate(id)}
                      className={`flex min-h-10 min-w-0 items-center gap-2 px-2 text-left text-xs font-semibold sm:text-sm xl:w-full xl:px-3 ${screen === id ? 'bg-[#173b34] text-white' : 'text-[#52675e] hover:bg-[#e9efe5]'}`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{label}</span>
                      {screen === id && <ChevronRight size={14} className="ml-auto hidden shrink-0 xl:block" />}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <Notice notice={notice} dismiss={() => setNotice(null)} />
          {screen === 'dashboard' && <Dashboard records={records} loading={loading} todayArrivals={todayArrivals} onNavigate={navigate} onRefresh={loadRecords} />}

          {isForm && resource && (
            <section>
              <PageHeading eyebrow="Formulario de registro" title={resource.title} detail={editingId ? `Modificando ${resource.singular} #${editingId}` : `Agrega o selecciona un registro de ${resource.plural}`} />
              <form onSubmit={saveRecord} className="border border-[#dce5da] bg-white">
                <div className="grid gap-4 border-b border-[#e6ece4] bg-[#f9fbf7] p-4 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-end sm:px-6">
                  <label htmlFor="record-picker" className="block text-xs font-bold uppercase tracking-wide text-[#66766c]">
                    Registro para modificar o eliminar
                    <select id="record-picker" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="field-control mt-2 normal-case tracking-normal">
                      <option value="">Selecciona un registro</option>
                      {items.map((item) => <option key={item[resource.id]} value={item[resource.id]}>{recordLabel(type, item)}</option>)}
                    </select>
                  </label>
                  <button className="action-button action-button-outline" type="button" disabled={!selectedId || busy} onClick={modifySelected}>Modificar</button>
                </div>

                <div className="grid gap-x-5 gap-y-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                  {resource.fields.map((field) => (
                    <FormField key={field.name} field={field} value={draft[field.name] ?? ''} onChange={(name, value) => setDraft((current) => ({ ...current, [name]: value }))} students={records.estudiantes} grades={records.grados} />
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[#e6ece4] bg-[#f9fbf7] p-4 sm:px-6">
                  <button className="action-button action-button-primary" type="button" onClick={() => { setDraft(emptyDraft(type)); setSelectedId(''); setEditingId(null); setNotice({ type: 'success', message: `Formulario listo para agregar ${resource.singular}.` }); }} disabled={busy}><Plus size={16} />Agregar</button>
                  <button className="action-button action-button-save" type="submit" disabled={busy}>{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}Guardar</button>
                  <button className="action-button action-button-outline" type="button" onClick={() => { setDraft(emptyDraft(type)); setSelectedId(''); setEditingId(null); setNotice(null); }} disabled={busy}><X size={16} />Borrar</button>
                  <button className="action-button action-button-danger" type="button" onClick={() => deleteRecord()} disabled={!selectedId || busy}><Trash2 size={16} />Eliminar</button>
                </div>
              </form>
              <p className="mt-3 text-xs text-[#78867e]">Agregar inicia un registro nuevo. Modificar carga el registro seleccionado; Guardar aplica los cambios.</p>
            </section>
          )}

          {isList && resource && <ListView type={type} records={items} students={records.estudiantes} grades={records.grados} loading={loading} onModify={(record) => openForModification(type, record)} onRefresh={loadRecords} onOpenForm={() => navigate(`form:${type}`)} />}

          <footer className="mt-9 flex items-center justify-between border-t border-[#dce5da] pt-4 text-[10px] text-[#89958e]">
            <span>Colegio La Pulida S.A.</span><span>Gestión de asistencia</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, detail, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#718c4c]">{eyebrow}</p><h2 className="font-display text-2xl font-extrabold text-[#173b34]">{title}</h2><p className="mt-1 text-sm text-[#68776f]">{detail}</p></div>
      {action}
    </div>
  );
}

function Dashboard({ records, loading, todayArrivals, onNavigate, onRefresh }) {
  const stats = [
    { label: 'Estudiantes', value: records.estudiantes.length, icon: UsersRound, tone: 'lime' },
    { label: 'Grados', value: records.grados.length, icon: BookOpen, tone: 'sky' },
    { label: 'Llegadas de hoy', value: todayArrivals, icon: Clock3, tone: 'coral' },
  ];
  return (
    <>
      <PageHeading eyebrow="Panel principal" title="Resumen" detail="Acceso directo a registros y consultas" action={<button type="button" className="action-button action-button-outline" onClick={onRefresh} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Actualizar</button>} />
      <section className="mb-7 grid gap-3 sm:grid-cols-3" aria-label="Totales">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="border border-[#dce5da] bg-white p-4">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium text-[#718078]">{label}</p><p className="mt-1 font-display text-3xl font-extrabold tabular-nums">{value}</p></div><span className={`grid size-10 place-items-center ${tone === 'lime' ? 'bg-[#edf4df] text-[#557333]' : tone === 'sky' ? 'bg-[#e5f0ee] text-[#317267]' : 'bg-[#ffede7] text-[#a75541]'}`}><Icon size={19} /></span></div>
          </article>
        ))}
      </section>
      <section>
        <h3 className="mb-3 font-display text-base font-bold">Accesos rápidos</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(resources).map(([id, resource]) => {
            const Icon = resource.icon;
            return <article key={id} className="border border-[#dce5da] bg-white p-4"><div className="flex items-center gap-2 font-semibold"><Icon size={18} className="text-[#63834a]" />{resource.title}</div><div className="mt-4 flex flex-wrap gap-2"><button className="action-button action-button-primary" type="button" onClick={() => onNavigate(`form:${id}`)}><Plus size={15} />Agregar</button><button className="action-button action-button-outline" type="button" onClick={() => onNavigate(`list:${id}`)}>Ver lista</button></div></article>;
          })}
        </div>
      </section>
    </>
  );
}

function recordLabel(type, record) {
  if (type === 'estudiantes') return `${record.nombre} · ${record.nie}`;
  if (type === 'grados') return record.nombreGrado;
  return `#${record.idLlegadaTarde} · ${record.fecha} ${record.horaLlegadaTardia}`;
}

function ListView({ type, records, students, grades, loading, onModify, onRefresh, onOpenForm }) {
  const resource = resources[type];
  const Icon = resource.icon;
  const columns = type === 'estudiantes' ? ['NIE', 'Nombre', 'Responsable', 'Teléfono'] : type === 'grados' ? ['ID', 'Nombre del grado'] : ['Estudiante', 'Grado', 'Fecha', 'Hora', 'Detalle'];
  return (
    <section>
      <PageHeading eyebrow="Consulta de registros" title={`Lista de ${resource.plural}`} detail={`${records.length} registros disponibles`} action={<div className="flex gap-2"><button type="button" className="action-button action-button-outline" onClick={onRefresh} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Actualizar</button><button type="button" className="action-button action-button-primary" onClick={onOpenForm}><Plus size={16} />Agregar</button></div>} />
      <div className="overflow-hidden border border-[#dce5da] bg-white">
        {loading ? <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#68776f]"><LoaderCircle size={18} className="animate-spin" />Cargando lista</div> : records.length === 0 ? <div className="grid min-h-48 place-items-center px-5 py-10 text-center"><div><Icon size={22} className="mx-auto mb-2 text-[#82946f]" /><p className="text-sm font-semibold">No hay {resource.plural} registrados</p><button type="button" onClick={onOpenForm} className="mt-3 text-sm font-bold text-[#597b34] hover:underline">Agregar {resource.singular}</button></div></div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-[#f3f7f1] text-[10px] font-bold uppercase tracking-[0.1em] text-[#748078]"><tr>{columns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}<th className="px-4 py-3">Acciones</th></tr></thead>
              <tbody className="divide-y divide-[#edf1eb]">
                {records.map((record) => (
                  <tr key={record[resource.id]} className="text-[#52675e]">
                    {type === 'estudiantes' && <><td className="px-4 py-3 tabular-nums">{record.nie}</td><td className="px-4 py-3 font-semibold text-[#203f36]">{record.nombre}</td><td className="px-4 py-3">{record.responsable}</td><td className="px-4 py-3">{record.telefono}</td></>}
                    {type === 'grados' && <><td className="px-4 py-3 tabular-nums">{record.idGrado}</td><td className="px-4 py-3 font-semibold text-[#203f36]">{record.nombreGrado}</td></>}
                    {type === 'llegadas-tardes' && <><td className="px-4 py-3 font-semibold text-[#203f36]">{students.find((item) => item.idEstudiente === record.idEstudiente)?.nombre || `Estudiante #${record.idEstudiente}`}</td><td className="px-4 py-3">{grades.find((item) => item.idGrado === record.idGrado)?.nombreGrado || `Grado #${record.idGrado}`}</td><td className="px-4 py-3 tabular-nums">{record.fecha}</td><td className="px-4 py-3 tabular-nums">{record.horaLlegadaTardia}</td><td className="max-w-48 truncate px-4 py-3">{record.detalle || '—'}</td></>}
                    <td className="px-4 py-3"><button type="button" onClick={() => onModify(record)} className="text-xs font-bold text-[#507433] hover:underline">Modificar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;