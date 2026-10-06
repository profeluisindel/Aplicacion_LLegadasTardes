async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('No se pudo contactar con la API. Comprueba que el backend esté activo.');
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'No se pudo completar la solicitud.');
  }
  return data;
}

function send(path, method, data) {
  return request(path, { method, body: JSON.stringify(data) });
}

export const api = {
  list: (resource) => request(resource),
  create: (resource, data) => send(resource, 'POST', data),
  update: (resource, id, data) => send(`${resource}/${id}`, 'PUT', data),
  remove: (resource, id) => request(`${resource}/${id}`, { method: 'DELETE' }),
};