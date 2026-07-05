const API_URL = 'http://localhost:3000/api';

async function fetchWithAuth(url: string, token?: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as any) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function postJson(url: string, data: unknown) {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    // Le backend renvoie { message, error, statusCode } -> on remonte un message lisible
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || res.statusText);
  }
  return body;
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string; role: 'admin' | 'user' }) =>
      postJson('/auth/register', data),
    login: (data: { email: string; password: string }) => postJson('/auth/login', data),
  },
  events: {
    findAll: (token?: string) => fetchWithAuth('/events', token),
    findOne: (id: string, token?: string) => fetchWithAuth(`/events/${id}`, token),
    create: (data: any, token: string) =>
      fetchWithAuth('/events', token, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      fetchWithAuth(`/events/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (id: string, token: string) =>
      fetchWithAuth(`/events/${id}`, token, { method: 'DELETE' }),
  },
  tickets: {
    findAll: (token?: string) => fetchWithAuth('/tickets', token),
    findMyTickets: (token: string) => fetchWithAuth('/tickets/my-tickets', token),
    create: (
      data: {
        eventId: string;
        buyerName: string;
        buyerEmail: string;
        buyerPhone?: string;
        ticketType?: 'early' | 'standard';
        quantity: number;
        notes?: string;
      },
      token: string,
    ) =>
      fetchWithAuth('/tickets', token, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    cancel: (id: string, token: string) =>
      fetchWithAuth(`/tickets/${id}/cancel`, token, { method: 'PATCH' }),
    remove: (id: string, token: string) =>
      fetchWithAuth(`/tickets/${id}`, token, { method: 'DELETE' }),
  },
  artists: {
    findAll: (token?: string) => fetchWithAuth('/artists', token),
    findOne: (id: string, token?: string) => fetchWithAuth(`/artists/${id}`, token),
    create: (data: any, token: string) =>
      fetchWithAuth('/artists', token, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      fetchWithAuth(`/artists/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (id: string, token: string) =>
      fetchWithAuth(`/artists/${id}`, token, { method: 'DELETE' }),
  },
  users: {
    findAll: (token: string) => fetchWithAuth('/users', token),
    findOne: (id: string, token: string) => fetchWithAuth(`/users/${id}`, token),
    update: (id: string, data: any, token: string) =>
      fetchWithAuth(`/users/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (id: string, token: string) =>
      fetchWithAuth(`/users/${id}`, token, { method: 'DELETE' }),
  },
  weather: {
    current: (city: string, token: string) => fetchWithAuth(`/weather/current?city=${encodeURIComponent(city)}`, token),
  },
  upload: {
    // Envoie un fichier image au backend (multipart/form-data) et retourne { filename, url }
    image: async (file: File, token: string) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
        throw new Error(message || res.statusText);
      }
      return body as { filename: string; url: string };
    },
  },
  currency: {
    // Convertit un montant en CFA (XOF) vers EUR/USD/GBP — endpoint public, pas de token requis
    convert: (amount: number, to: 'EUR' | 'USD' | 'GBP') =>
      fetchWithAuth(`/currency/convert?amount=${amount}&to=${to}`) as Promise<{
        amount: number;
        from: string;
        to: string;
        rate: number;
        convertedAmount: number;
        lastUpdated: string;
      }>,
  },
};