const text = (name, label, placeholder, options = {}) => ({ name, label, placeholder, type: 'text', ...options });

export const resources = {
  estudiantes: {
    key: 'estudiantes',
    singular: 'Estudiante',
    plural: 'Estudiantes',
    endpoint: 'estudiantes',
    idField: 'idEstudiante',
    icon: 'students',
    eyebrow: 'Comunidad escolar',
    description: 'Administra los datos de identificación y contacto de cada estudiante.',
    fields: [
      text('nie', 'NIE', 'Ej. 12345678'),
      text('nombre', 'Nombre completo', 'Nombre del estudiante'),
      text('responsable', 'Responsable', 'Nombre de madre, padre o tutor'),
      text('telefono', 'Teléfono del responsable', 'Ej. 7000-0000', { type: 'tel' })
    ],
    columns: [
      { key: 'nie', label: 'NIE' },
      { key: 'nombre', label: 'Estudiante', primary: true },
      { key: 'responsable', label: 'Responsable' },
      { key: 'telefono', label: 'Teléfono' }
    ],
    searchValue: (row) => `${row.nie} ${row.nombre} ${row.responsable} ${row.telefono}`
  },
  grados: {
    key: 'grados',
    singular: 'Grado',
    plural: 'Grados',
    endpoint: 'grados',
    idField: 'idGrado',
    icon: 'grade',
    eyebrow: 'Oferta académica',
    description: 'Organiza los grados que se relacionan con las llegadas tardías.',
    fields: [text('nombre', 'Nombre del grado', 'Ej. Séptimo grado')],
    columns: [{ key: 'nombre', label: 'Grado', primary: true }],
    searchValue: (row) => row.nombre
  },
  llegadasTardes: {
    key: 'llegadasTardes',
    singular: 'Llegada tardía',
    plural: 'Llegadas tardías',
    endpoint: 'llegadas-tardes',
    idField: 'idLlegadaTarde',
    icon: 'clock',
    eyebrow: 'Control de asistencia',
    description: 'Registra la hora, fecha y detalle vinculados a cada estudiante y grado.',
    fields: [
      { name: 'idEstudiante', label: 'Estudiante', type: 'select', optionSource: 'estudiantes' },
      { name: 'idGrado', label: 'Grado', type: 'select', optionSource: 'grados' },
      { name: 'horaLlegada', label: 'Hora de llegada', type: 'time' },
      { name: 'fecha', label: 'Fecha', type: 'date' },
      { name: 'detalle', label: 'Detalle', type: 'textarea', placeholder: 'Describe brevemente el motivo o contexto' }
    ],
    columns: [
      { key: 'estudiante', label: 'Estudiante', primary: true, value: (row) => row.estudiante?.nombre || '—' },
      { key: 'grado', label: 'Grado', value: (row) => row.grado?.nombre || '—' },
      { key: 'horaLlegada', label: 'Hora', value: (row) => formatTime(row.horaLlegada) },
      { key: 'fecha', label: 'Fecha', value: (row) => formatDate(row.fecha) },
      { key: 'detalle', label: 'Detalle' }
    ],
    searchValue: (row) => `${row.estudiante?.nombre || ''} ${row.grado?.nombre || ''} ${row.detalle || ''} ${formatDate(row.fecha)}`
  }
};

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

export function formatTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('es-SV', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(date);
}

export function recordToForm(resource, record) {
  if (!record) return {};
  if (resource.key !== 'llegadasTardes') return Object.fromEntries(resource.fields.map(({ name }) => [name, record[name] ?? '']));
  return {
    idEstudiante: String(record.idEstudiante),
    idGrado: String(record.idGrado),
    horaLlegada: formatTimeInput(record.horaLlegada),
    fecha: record.fecha ? new Date(record.fecha).toISOString().slice(0, 10) : '',
    detalle: record.detalle ?? ''
  };
}

function formatTimeInput(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}
