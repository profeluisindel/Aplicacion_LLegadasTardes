import Icon from './Icon';

const manageItems = [
  { id: 'estudiantes-form', label: 'Estudiantes', icon: 'students' },
  { id: 'grados-form', label: 'Grados', icon: 'grade' },
  { id: 'llegadasTardes-form', label: 'Llegadas tardías', icon: 'clock' }
];
const listItems = [
  { id: 'estudiantes-list', label: 'Lista de estudiantes' },
  { id: 'grados-list', label: 'Lista de grados' },
  { id: 'llegadasTardes-list', label: 'Lista de llegadas' }
];

export default function Sidebar({ activeView, onNavigate, mobileOpen, onClose }) {
  const nav = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Cerrar menú" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="book" size={23} /></div>
          <div><strong>La Pulida</strong><span>GESTIÓN ESCOLAR</span></div>
          <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú"><Icon name="close" /></button>
        </div>

        <button className={`nav-item home-link ${activeView === 'inicio' ? 'active' : ''}`} onClick={() => nav('inicio')}>
          <Icon name="home" /><span>Inicio</span><Icon name="chevron" size={15} className="nav-chevron" />
        </button>

        <div className="nav-section-label">Administración</div>
        <nav aria-label="Administración">
          {manageItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => nav(item.id)}>
              <Icon name={item.icon} /><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav-section-label list-label">Consultas</div>
        <nav aria-label="Listados">
          {listItems.map((item) => (
            <button key={item.id} className={`nav-item nav-subitem ${activeView === item.id ? 'active' : ''}`} onClick={() => nav(item.id)}>
              <span className="nav-dot" /><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-icon"><Icon name="book" size={17} /></div>
          <div><strong>Colegio La Pulida S.A.</strong><span>Control de asistencia</span></div>
        </div>
      </aside>
    </>
  );
}
