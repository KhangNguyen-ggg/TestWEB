const API_BASE_URL = 'https://testweb-3dku.onrender.com/api';

async function apiFetch(endpoint, options = {}) {
    return fetch(`${API_BASE_URL}${endpoint}`, options);
}