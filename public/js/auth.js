// auth.js – gerencia token JWT apenas em memória e fornece helper de fetch
let _token = null;

export const setToken = (token) => {
  _token = token;
};

export const getToken = () => _token;

export const apiFetch = async (url, options = {}) => {
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...( _token ? { Authorization: `Bearer ${_token}` } : {} ),
  };
  const resp = await fetch(url, { ...options, headers });
  return resp.json();
};
