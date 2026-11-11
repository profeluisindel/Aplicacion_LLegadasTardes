import DataTable from '../components/DataTable';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

export default function ResourceListPage({ resource, records, onEdit, onDelete, onCreate }) {
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="Consulta de información"
        title={resource.plural}
        description={`Listado actualizado directamente desde la API del colegio.`}
        action={<button className="button button-primary" onClick={onCreate}><Icon name="plus" size={17} />Nuevo {resource.singular.toLowerCase()}</button>}
      />
      <DataTable resource={resource} records={records} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
