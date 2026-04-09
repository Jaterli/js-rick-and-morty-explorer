class FavoritesManager {
    constructor() {
        this.storageKey = 'rickmorty_favorites';
        this.favorites = this.loadFavorites();
    }

    loadFavorites() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    }

    isFavorite(id) {
        return this.favorites.some(fav => fav.id === id);
    }

    addFavorite(character) {
        if (!this.isFavorite(character.id)) {
            this.favorites.push({
                id: character.id,
                name: character.name,
                image: character.image,
                status: character.status,
                species: character.species
            });
            this.saveFavorites();
            return true;
        }
        return false;
    }

    removeFavorite(id) {
        this.favorites = this.favorites.filter(fav => fav.id !== id);
        this.saveFavorites();
        return true;
    }

    toggleFavorite(character) {
        if (this.isFavorite(character.id)) {
            this.removeFavorite(character.id);
            return false;
        } else {
            this.addFavorite(character);
            return true;
        }
    }

    getFavorites() {
        return this.favorites;
    }

    getFavoritesCount() {
        return this.favorites.length;
    }
}

const favoritesManager = new FavoritesManager();