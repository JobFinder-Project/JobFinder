/**
 * Configuração base para chamadas de API
 */

const API_BASE_URL = '/api'

/**
 * Wrapper para fetch com configurações padrão
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
    },
  }

  // Adiciona Content-Type JSON apenas se não for FormData
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, config)
  
  // Tenta parsear como JSON, se falhar retorna texto
  let data
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const error = new Error(data?.error || data?.message || 'Erro na requisição')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

/**
 * Métodos HTTP
 */
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  
  post: (endpoint, body) => request(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),
  
  put: (endpoint, body) => request(endpoint, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),
  
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

export default api
