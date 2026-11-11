import { useMemo, useState } from 'react';
import Icon from './Icon';

export default function DataTable({ resource, records, onEdit, onDelete, onSelect, selectedId, compact = false }) {
  const [query, setQuery] = useState('');
  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    if (!normalized) return records;
    return records.filter((record) => resource.searchValue(record).toLocaleLowerCase('es').includes(normalized));
  }, [query, records, resource]);

  return (
    <div className={`table-card ${compact ? 'table-card-compact' : ''}`}>
      <div className="table-toolbar">
        <div><h3>{compact ? 'Registros guardados' : 'Registros'}</h3><span>{records.length} {records.length === 1 ? 'registro' : 'registros'}</span></div>
        <label className="table-search flex items-center gap-2">
          <Icon name="search" size={17} />
          <input aria-label="Buscar registro" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar…" />
        </label>
      </div>

      <div className="table-scroll">
        <table>
          <thead><tr>
            {resource.columns.map((column) => <th key={column.key}>{column.label}</th>)}
            {(onEdit || onDelete || onSelect) && <th className="actions-heading">Acciones</th>}
          </tr></thead>
          <tbody>
            {visibleRecords.map((record) => {
              const id = record[resource.idField];
              const selected = selectedId === id;
              return (
                <tr key={id} className={selected ? 'selected-row' : ''} onClick={() => onSelect?.(record)}>
                  {resource.columns.map((column) => (
                    <td key={column.key} className={column.primary ? 'primary-cell' : ''}>
                      {column.value ? column.value(record) : record[column.key] || '—'}
                    </td>
                  ))}
                  {(onEdit || onDelete || onSelect) && <td className="row-actions">
                    {onSelect && <button className={`mini-action ${selected ? 'selected-action' : ''}`} onClick={(event) => { event.stopPropagation(); onSelect(record); }} aria-label={`Seleccionar ${resource.singular}`} title="Seleccionar">{selected ? <Icon name="check" size={16} /> : <Icon name="chevron" size={16} />}</button>}
                    {onEdit && <button className="mini-action" onClick={(event) => { event.stopPropagation(); onEdit(record); }} aria-label={`Modificar ${resource.singular}`} title="Modificar"><Icon name="edit" size={16} /></button>}
                    {onDelete && <button className="mini-action danger-action" onClick={(event) => { event.stopPropagation(); onDelete(record); }} aria-label={`Eliminar ${resource.singular}`} title="Eliminar"><Icon name="trash" size={16} /></button>}
                  </td>}
                </tr>
              );
            })}
            {visibleRecords.length === 0 && (
              <tr><td colSpan={resource.columns.length + 1}>
                <div className="empty-table"><span className="empty-icon"><Icon name={resource.icon} size={20} /></span><strong>{records.length ? 'No hay coincidencias' : 'Aún no hay registros'}</strong><span>{records.length ? 'Prueba con otra búsqueda.' : 'Los registros creados aparecerán aquí.'}</span></div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
