// Estado de la aplicación
let currentPage = 1;
let currentFilters = { name: '', status: '', species: '' };
let currentView = 'characters';
let currentEpisodesPage = 1;
let currentEpisodeSearch = '';

// Elementos DOM
const charactersView = document.getElementById('charactersView');
const episodesView = document.getElementById('episodesView');
const navButtons = document.querySelectorAll('.nav-btn');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const speciesFilter = document.getElementById('speciesFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const episodesPrevBtn = document.getElementById('episodesPrevPage');
const episodesNextBtn = document.getElementById('episodesNextPage');
const episodesPageInfo = document.getElementById('episodesPageInfo');
const episodeSearch = document.getElementById('episodeSearch');
const favoritesBtn = document.getElementById('favoritesBtn');

// Variables de paginación
let totalPages = 1;
let totalEpisodesPages = 1;

// Cargar personajes
async function loadCharacters() {
    ui.showLoading(true);
    
    try {
        const data = await api.getCharacters(currentPage, currentFilters);
        
        if (data.error) {
            ui.showError(data.error);
            ui.renderCharacters([], []);
            return;
        }
        
        totalPages = data.info.pages;
        ui.renderCharacters(data.results);
        
        // Actualizar paginación
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        
        // Agregar eventos a las tarjetas
        attachCharacterEvents();
        
    } catch (error) {
        console.error('Error loading characters:', error);
        ui.showError('Error al cargar los personajes. Por favor, intenta de nuevo.');
        ui.renderCharacters([], []);
    } finally {
        ui.showLoading(false);
    }
}

// Cargar episodios
async function loadEpisodes() {
    ui.showLoading(true, true);
    
    try {
        const data = await api.getEpisodes(currentEpisodesPage, currentEpisodeSearch);
        
        totalEpisodesPages = data.info.pages;
        ui.renderEpisodes(data.results);
        
        episodesPageInfo.textContent = `Página ${currentEpisodesPage} de ${totalEpisodesPages}`;
        episodesPrevBtn.disabled = currentEpisodesPage === 1;
        episodesNextBtn.disabled = currentEpisodesPage === totalEpisodesPages;
        
        attachEpisodeEvents();
        
    } catch (error) {
        console.error('Error loading episodes:', error);
        ui.showError('Error al cargar los episodios', true);
        ui.renderEpisodes([]);
    } finally {
        ui.showLoading(false, true);
    }
}

// Eventos de personajes
function attachCharacterEvents() {
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', async (e) => {
            if (e.target.closest('.fav-btn')) return;
            const id = parseInt(card.dataset.id);
            await showCharacterDetail(id);
        });
    });
    
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const character = await api.getCharacterById(id);
            favoritesManager.toggleFavorite(character);
            ui.updateFavoritesCount();
            loadCharacters(); // Recargar para actualizar íconos
            document.dispatchEvent(new CustomEvent('favoritesUpdated'));
        });
    });
}

// Eventos de episodios
function attachEpisodeEvents() {
    document.querySelectorAll('.episode-card').forEach(card => {
        card.addEventListener('click', async () => {
            const id = parseInt(card.dataset.id);
            await showEpisodeDetail(id);
        });
    });
}

// Mostrar detalle de personaje
async function showCharacterDetail(id) {
    try {
        const character = await api.getCharacterById(id);
        const episodeUrls = character.episode || [];
        const episodes = await Promise.all(
            episodeUrls.slice(0, 10).map(url => fetch(url).then(r => r.json()))
        );
        ui.renderCharacterDetail(character, episodes);
    } catch (error) {
        console.error('Error loading character detail:', error);
        ui.showError('Error al cargar el detalle del personaje');
    }
}

// Mostrar detalle de episodio
async function showEpisodeDetail(id) {
    try {
        const episode = await api.getEpisodeById(id);
        const characterIds = episode.characters.map(url => {
            const parts = url.split('/');
            return parseInt(parts[parts.length - 1]);
        });
        const characters = await api.getMultipleCharacters(characterIds);
        ui.renderEpisodeDetail(episode, characters);
    } catch (error) {
        console.error('Error loading episode detail:', error);
        ui.showError('Error al cargar el detalle del episodio');
    }
}

// Mostrar favoritos
function showFavorites() {
    const favorites = favoritesManager.getFavorites();
    if (favorites.length === 0) {
        ui.showError('No tienes personajes favoritos aún. ¡Agrega algunos!');
        return;
    }
    ui.renderCharacters(favorites);
    attachCharacterEvents();
    
    // Reset paginación visual
    pageInfo.textContent = `Favoritos (${favorites.length})`;
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
}

// Cambiar vista
function switchView(view) {
    currentView = view;
    
    navButtons.forEach(btn => {
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    if (view === 'characters') {
        charactersView.classList.add('active');
        episodesView.classList.remove('active');
        loadCharacters();
    } else if (view === 'episodes') {
        charactersView.classList.remove('active');
        episodesView.classList.add('active');
        loadEpisodes();
    } else { // 'favorites') 
        charactersView.classList.add('active');
        episodesView.classList.remove('active');
        showFavorites();
    }
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    currentFilters.name = e.target.value;
    currentPage = 1;
    loadCharacters();
});

statusFilter.addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    currentPage = 1;
    loadCharacters();
});

speciesFilter.addEventListener('change', (e) => {
    currentFilters.species = e.target.value;
    currentPage = 1;
    loadCharacters();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadCharacters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadCharacters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

episodesPrevBtn.addEventListener('click', () => {
    if (currentEpisodesPage > 1) {
        currentEpisodesPage--;
        loadEpisodes();
    }
});

episodesNextBtn.addEventListener('click', () => {
    if (currentEpisodesPage < totalEpisodesPages) {
        currentEpisodesPage++;
        loadEpisodes();
    }
});

episodeSearch.addEventListener('input', (e) => {
    currentEpisodeSearch = e.target.value;
    currentEpisodesPage = 1;
    loadEpisodes();
});

favoritesBtn.addEventListener('click', () => {
    if (currentView !== 'characters') {
        switchView('characters');
    }
    showFavorites();
});

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
    });
});

// Cerrar modal
document.querySelector('.modal-close')?.addEventListener('click', () => ui.closeModal());
window.addEventListener('click', (e) => {
    if (e.target === ui.modal) ui.closeModal();
});

// Actualizar contador de favoritos
document.addEventListener('favoritesUpdated', () => ui.updateFavoritesCount());

// Inicializar
ui.updateFavoritesCount();
loadCharacters();