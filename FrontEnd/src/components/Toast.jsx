import Icon from './Icon';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type || 'success'}`} role="status">
      <span className="toast-icon"><Icon name={toast.type === 'error' ? 'close' : 'check'} size={16} /></span>
      <span>{toast.message}</span>
      <button aria-label="Cerrar mensaje" onClick={onClose}><Icon name="close" size={16} /></button>
    </div>
  );
}
