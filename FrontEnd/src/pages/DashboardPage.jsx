import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import { formatDate, formatTime, resources } from '../config/resources';

const currentHour = new Date().getHours();
const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 19 ? 'Buenas tardes' : 'Buenas noches';

export default function DashboardPage({ data, onNavigate, connected, onRefresh, loading }) {
  const cards = [
    { label: 'Estudiantes registrados', count: data.estudiantes.length, icon: 'students', tint: 'blue', target: 'estudiantes-list' },
    { label: 'Grados académicos', count: data.grados.length, icon: 'grade', tint: 'violet', target: 'grados-list' },
    { label: 'Llegadas tardías', count: data.llegadasTardes.length, icon: 'clock', tint: 'amber', target: 'llegadasTardes-list' }
  ];

  return (
    <div className="page-content dashboard-page">
      <PageHeader eyebrow="Panel principal" title={greeting} description="Un espacio claro para acompañar la jornada escolar." action={<div className={`connection-pill ${connected ? 'connection-on' : 'connection-off'}`}><span />{connected ? 'API conectada' : 'API sin conexión'}</div>} />

      {!connected && <div className="connection-alert"><div><strong>No se pudo conectar con la API</strong><span>Inicia el backend y vuelve a cargar los datos.</span></div><button className="button button-light" onClick={onRefresh} disabled={loading}><Icon name="refresh" size={16} />Reintentar</button></div>}

      <section className="hero-card">
        <img className="hero-art" src="/campus.svg" alt="Ilustración del campus del Colegio La Pulida" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="hero-kicker">COLEGIO LA PULIDA S.A.</span>
          <h2>Una llegada a tiempo<br />empieza con un buen día.</h2>
          <p>Registra, organiza y consulta la asistencia de nuestra comunidad escolar.</p>
          <button className="hero-button" onClick={() => onNavigate('llegadasTardes-form')}>Registrar llegada tardía <Icon name="arrow" size={17} /></button>
        </div>
        <div className="hero-caption"><span className="hero-sun" />Cada día cuenta</div>
      </section>

      <div className="stats-grid">
        {cards.map((card) => (
          <button className="stat-card" key={card.label} onClick={() => onNavigate(card.target)}>
            <span className={`stat-icon stat-${card.tint}`}><Icon name={card.icon} size={21} /></span>
            <span className="stat-copy"><span>{card.label}</span><strong>{loading ? '—' : card.count}</strong></span>
            <Icon name="chevron" className="stat-chevron" size={17} />
          </button>
        ))}
      </div>

      <div className="dashboard-bottom">
        <section className="quick-card">
          <div className="section-title"><div><span className="eyebrow">Accesos directos</span><h2>¿Qué necesitas hacer?</h2></div></div>
          <div className="quick-grid">
            {[resources.estudiantes, resources.grados, resources.llegadasTardes].map((resource) => (
              <button key={resource.key} className="quick-link" onClick={() => onNavigate(`${resource.key}-form`)}>
                <span className="quick-icon"><Icon name={resource.icon} size={19} /></span>
                <span><strong>Agregar {resource.singular.toLowerCase()}</strong><small>Crear un nuevo registro</small></span>
                <Icon name="arrow" size={16} className="quick-arrow" />
              </button>
            ))}
          </div>
        </section>

        <section className="recent-card">
          <div className="recent-heading"><div><span className="eyebrow">Actividad</span><h2>Últimas llegadas</h2></div><button onClick={() => onNavigate('llegadasTardes-list')}>Ver todas <Icon name="arrow" size={15} /></button></div>
          {data.llegadasTardes.length === 0 ? (
            <div className="recent-empty"><span className="empty-icon"><Icon name="clock" size={20} /></span><strong>Sin llegadas registradas</strong><span>Las nuevas llegadas aparecerán aquí.</span></div>
          ) : (
            <div className="recent-list">
              {[...data.llegadasTardes].slice(-4).reverse().map((arrival) => (
                <div className="recent-row" key={arrival.idLlegadaTarde}>
                  <span className="recent-time">{formatTime(arrival.horaLlegada)}</span>
                  <span className="recent-info"><strong>{arrival.estudiante?.nombre || 'Estudiante'}</strong><small>{arrival.grado?.nombre || 'Grado'} · {formatDate(arrival.fecha)}</small></span>
                  <Icon name="chevron" size={15} className="recent-chevron" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <div className="dashboard-footnote"><span />Los datos mostrados provienen de la API del colegio.</div>
    </div>
  );
}
