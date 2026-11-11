const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || 'No se pudo completar la solicitud.';
    throw new Error(message);
  }
  return payload;
}

export { API_BASE_URL };
