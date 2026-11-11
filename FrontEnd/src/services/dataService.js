import { request } from './api';

export const resourceService = {
  list: (endpoint) => request(`/${endpoint}`).then((response) => response.data),
  create: (endpoint, data) => request(`/${endpoint}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (endpoint, id, data) => request(`/${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (endpoint, id) => request(`/${endpoint}/${id}`, { method: 'DELETE' })
};

export async function loadDashboardData() {
  const [estudiantes, grados, llegadasTardes] = await Promise.all([
    resourceService.list('estudiantes'),
    resourceService.list('grados'),
    resourceService.list('llegadas-tardes')
  ]);
  return { estudiantes, grados, llegadasTardes };
}
