class UIManager {
    constructor() {
        this.charactersGrid = document.getElementById('charactersGrid');
        this.episodesGrid = document.getElementById('episodesGrid');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        this.modal = document.getElementById('detailModal');
        this.modalBody = document.getElementById('modalBody');
        this.favoritesCount = document.getElementById('favoritesCount');
    }

    showLoading(show, isEpisodes = false) {
        const loadingEl = isEpisodes ? document.getElementById('episodesLoading') : this.loadingIndicator;
        if (loadingEl) {
            if (show) loadingEl.classList.remove('hidden');
            else loadingEl.classList.add('hidden');
        }
    }

    showError(message, isEpisodes = false) {
        const errorEl = isEpisodes ? document.getElementById('episodesError') : this.errorMessage;
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            setTimeout(() => errorEl.classList.add('hidden'), 5000);
        } else {
            console.error(message);
        }
    }

    renderCharacters(characters) {
        if (!this.charactersGrid) return;
        
        if (!characters.length) {
            this.charactersGrid.innerHTML = '<div class="error-message">No se encontraron personajes</div>';
            return;
        }
        this.charactersGrid.innerHTML = characters.map(character => `
            <div class="character-card" data-id="${character.id}">
                <button class="fav-btn ${favoritesManager.isFavorite(character.id) ? 'active' : ''}" data-id="${character.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <img class="character-img" src="${character.image}" alt="${character.name}" loading="lazy">
                <div class="character-info">
                    <div class="character-name">
                        ${this.escapeHtml(character.name)}
                    </div>
                    <div class="character-status">
                        <span class="status-badge status-${character.status.toLowerCase()}"></span>
                        ${character.status} - ${character.species}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderEpisodes(episodes) {
        if (!this.episodesGrid) return;
        
        if (!episodes.length) {
            this.episodesGrid.innerHTML = '<div class="error-message">No se encontraron episodios</div>';
            return;
        }

        this.episodesGrid.innerHTML = episodes.map(episode => `
            <div class="episode-card" data-id="${episode.id}">
                <div class="episode-name">${this.escapeHtml(episode.name)}</div>
                <div class="episode-info">
                    <span><i class="fas fa-calendar"></i> ${episode.air_date}</span>
                    <span><i class="fas fa-hashtag"></i> ${episode.episode}</span>
                </div>
            </div>
        `).join('');
    }

    renderCharacterDetail(character, episodes) {
        const isFav = favoritesManager.isFavorite(character.id);
        
        this.modalBody.innerHTML = `
            <div class="character-detail">
                <img class="character-detail-img" src="${character.image}" alt="${character.name}">
                <h2>${this.escapeHtml(character.name)}</h2>
                <button class="nav-btn favorites-nav-btn ${isFav ? 'active' : ''}" data-id="${character.id}">
                    <i class="fas fa-heart"></i> ${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                </button>
                <div class="detail-info">
                    <p><strong>Estado:</strong> ${character.status}</p>
                    <p><strong>Especie:</strong> ${character.species}</p>
                    <p><strong>Tipo:</strong> ${character.type || 'Ninguno'}</p>
                    <p><strong>Género:</strong> ${character.gender}</p>
                    <p><strong>Origen:</strong> ${character.origin?.name || 'Desconocido'}</p>
                    <p><strong>Ubicación:</strong> ${character.location?.name || 'Desconocida'}</p>
                    <p><strong>Episodios (${episodes.length}):</strong></p>
                    <div class="episodes-list">
                        ${episodes.map(ep => `<span class="episode-tag">${this.escapeHtml(ep.episode)} - ${this.escapeHtml(ep.name)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.modal.classList.add('active');
        
        const detailFavBtn = this.modalBody.querySelector('.favorites-nav-btn');
        if (detailFavBtn) {
            detailFavBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                favoritesManager.toggleFavorite(character);
                this.renderCharacterDetail(character, episodes);
                currentView === 'favorites' ? showFavorites() : loadCharacters();
                this.updateFavoritesCount();
                // Disparar evento para actualizar otras partes de la UI
                document.dispatchEvent(new CustomEvent('favoritesUpdated'));
            });
        }
    }

    renderEpisodeDetail(episode, characters) {
        this.modalBody.innerHTML = `
            <div class="character-detail">
                <h2>${this.escapeHtml(episode.name)}</h2>
                <div class="detail-info">
                    <p><strong>Episodio:</strong> ${episode.episode}</p>
                    <p><strong>Fecha de emisión:</strong> ${episode.air_date}</p>
                    <p><strong>Personajes (${characters.length}):</strong></p>
                    <div class="episodes-list">
                        ${characters.map(char => `
                            <div class="episode-tag character-link" data-id="${char.id}" style="cursor:pointer; background:rgba(76,175,80,0.3);">
                                ${this.escapeHtml(char.name)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.modal.classList.add('active');
        
        document.querySelectorAll('.character-link').forEach(el => {
            el.addEventListener('click', async () => {
                const charId = parseInt(el.dataset.id);
                const character = await api.getCharacterById(charId);
                const episodeUrls = character.episode || [];
                const episodesData = await Promise.all(
                    episodeUrls.slice(0, 10).map(url => fetch(url).then(r => r.json()))
                );
                this.renderCharacterDetail(character, episodesData);
            });
        });
    }

    updateFavoritesCount() {
        if (this.favoritesCount) {
            this.favoritesCount.textContent = favoritesManager.getFavoritesCount();
        }
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    closeModal() {
        this.modal.classList.remove('active');
    }
}

const ui = new UIManager();