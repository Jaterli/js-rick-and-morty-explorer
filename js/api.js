// API Configuration
const API_BASE = 'https://rickandmortyapi.com/api';

class RickMortyAPI {
    constructor() {
        this.cache = new Map();
    }

    async fetchWithCache(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            this.cache.set(url, data);
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getCharacters(page = 1, filters = {}) {
        let url = `${API_BASE}/character?page=${page}`;
        if (filters.name) url += `&name=${encodeURIComponent(filters.name)}`;
        if (filters.status && filters.status !== '') url += `&status=${filters.status}`;
        if (filters.species && filters.species !== '') url += `&species=${filters.species}`;
        
        return this.fetchWithCache(url);
    }

    async getCharacterById(id) {
        return this.fetchWithCache(`${API_BASE}/character/${id}`);
    }

    async getEpisodes(page = 1, search = '') {
        let url = `${API_BASE}/episode?page=${page}`;
        if (search) url += `&name=${encodeURIComponent(search)}`;
        return this.fetchWithCache(url);
    }

    async getEpisodeById(id) {
        return this.fetchWithCache(`${API_BASE}/episode/${id}`);
    }

    async getMultipleCharacters(ids) {
        if (!ids.length) return [];
        const url = `${API_BASE}/character/${ids.join(',')}`;
        const data = await this.fetchWithCache(url);
        return Array.isArray(data) ? data : [data];
    }

    clearCache() {
        this.cache.clear();
    }
}

const api = new RickMortyAPI();