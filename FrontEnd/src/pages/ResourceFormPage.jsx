import { useState } from 'react';
import DataTable from '../components/DataTable';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import { recordToForm } from '../config/resources';

export default function ResourceFormPage({ resource, records, relatedData, initialRecord, busy, onSave, onDelete, onNotify }) {
  const [selectedRecord, setSelectedRecord] = useState(initialRecord || null);
  const [formValues, setFormValues] = useState(() => recordToForm(resource, initialRecord));
  const [editable, setEditable] = useState(!initialRecord);
  const missingRelations = resource.fields.some((field) => field.optionSource && (relatedData[field.optionSource] || []).length === 0);

  const clearForm = () => {
    setSelectedRecord(null);
    setFormValues({});
    setEditable(true);
  };

  const selectRecord = (record) => {
    setSelectedRecord(record);
    setFormValues(recordToForm(resource, record));
    setEditable(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...formValues };
    if (resource.key === 'llegadasTardes') {
      payload.idEstudiante = Number(payload.idEstudiante);
      payload.idGrado = Number(payload.idGrado);
    }
    const saved = await onSave(resource, payload, selectedRecord?.[resource.idField]);
    if (saved) clearForm();
  };

  const askDelete = async () => {
    if (!selectedRecord) return onNotify('Selecciona un registro para eliminarlo.', 'error');
    if (!window.confirm(`¿Eliminar este registro de ${resource.singular.toLowerCase()}?`)) return;
    await onDelete(resource, selectedRecord[resource.idField]);
    clearForm();
  };

  const modify = () => {
    if (!selectedRecord) return onNotify('Selecciona un registro de la lista para modificarlo.', 'error');
    setEditable(true);
  };

  return (
    <div className="page-content">
      <PageHeader eyebrow={resource.eyebrow} title={`Administrar ${resource.plural.toLowerCase()}`} description={resource.description} />

      <div className="form-layout">
        <section className="form-card">
          <div className="form-card-heading">
            <span className="form-icon"><Icon name={resource.icon} size={20} /></span>
            <div><h2>{selectedRecord ? `Registro #${selectedRecord[resource.idField]}` : `Nuevo ${resource.singular.toLowerCase()}`}</h2><p>{selectedRecord ? 'Selecciona Modificar para editar los campos.' : 'Completa los campos para agregar un registro.'}</p></div>
            <span className={`form-state ${selectedRecord ? 'state-edit' : 'state-new'}`}>{selectedRecord ? 'Seleccionado' : 'Nuevo'}</span>
          </div>

          <form onSubmit={submit}>
            <div className="form-fields">
              {resource.fields.map((field) => {
                const value = formValues[field.name] ?? '';
                const options = field.optionSource ? relatedData[field.optionSource] || [] : [];
                const noOptions = field.type === 'select' && options.length === 0;
                const fieldProps = {
                  id: `${resource.key}-${field.name}`,
                  name: field.name,
                  value,
                  required: true,
                  disabled: !editable || noOptions,
                  onChange: (event) => setFormValues((previous) => ({ ...previous, [field.name]: event.target.value })),
                  placeholder: field.placeholder
                };

                return (
                  <label key={field.name} className={`field flex flex-col gap-1.5 field-${field.type} ${field.name === 'detalle' ? 'field-wide' : ''}`} htmlFor={fieldProps.id}>
                    <span>{field.label}<i>*</i></span>
                    {field.type === 'select' ? (
                      <select {...fieldProps}>
                        <option value="">{noOptions ? `Primero agrega ${field.optionSource === 'estudiantes' ? 'un estudiante' : 'un grado'}` : 'Selecciona una opción'}</option>
                        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea {...fieldProps} rows="3" maxLength="500" />
                    ) : (
                      <input {...fieldProps} type={field.type} maxLength={field.type === 'text' || field.type === 'tel' ? 160 : undefined} />
                    )}
                    {noOptions && <small className="field-hint">Necesitas registros relacionados para continuar.</small>}
                  </label>
                );
              })}
            </div>

            <div className="form-actions">
              <button className="button button-primary" type="button" onClick={clearForm}><Icon name="plus" size={17} />Agregar</button>
              <button className="button button-dark" type="submit" disabled={!editable || busy || missingRelations}><Icon name="check" size={17} />{busy ? 'Guardando…' : 'Guardar'}</button>
              <button className="button button-light" type="button" onClick={clearForm}>Borrar</button>
              <button className="button button-light" type="button" onClick={modify} disabled={!selectedRecord}>Modificar</button>
              <button className="button button-danger" type="button" onClick={askDelete} disabled={!selectedRecord || busy}><Icon name="trash" size={16} />Eliminar</button>
            </div>
          </form>
        </section>

        <div className="form-records">
          <DataTable resource={resource} records={records} compact onSelect={selectRecord} selectedId={selectedRecord?.[resource.idField]} />
          <div className="form-tip"><Icon name="check" size={16} /><span>Selecciona un registro para cargarlo en el formulario y modificarlo.</span></div>
        </div>
      </div>
    </div>
  );
}
