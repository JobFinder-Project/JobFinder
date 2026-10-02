const API_BASE_URL = '';
const ROOT_ENDPOINT_PREFIXES = ['/auth'];

const resolveUrl = (endpoint) => {
  if (ROOT_ENDPOINT_PREFIXES.some((prefix) => endpoint.startsWith(prefix))) {
    return endpoint;
  }

  return `${API_BASE_URL}${endpoint}`;
};

async function request(endpoint, options = {}) {
  const url = resolveUrl(endpoint);

  const config = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    },
  };

  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(
        data?.error || data?.message || 'Erro na requisição',
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint, body) =>
    request(endpoint, {
      method: 'DELETE',
      ...(body !== undefined && { body: JSON.stringify(body) }),
    }),
};

export default api;