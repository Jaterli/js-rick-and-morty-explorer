# Rick and Morty Explorer

![Rick and Morty Explorer](https://img.shields.io/badge/version-1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Aplicación web interactiva que permite explorar el universo de **Rick and Morty** consumiendo datos de la [API oficial](https://rickandmortyapi.com/). Descubre personajes, episodios, guarda tus favoritos y disfruta de una experiencia visual atractiva y completamente responsive.

## ✨ Características

### 🎭 Personajes
- **Listado paginado** de personajes con imagen, nombre, estado y especie
- **Búsqueda en tiempo real** por nombre
- **Filtros combinados** por estado (Vivo/Muerto/Desconocido) y especie
- **Vista detallada** con información completa: origen, ubicación, género y lista de episodios

### 📺 Episodios
- **Exploración paginada** de todos los episodios
- **Búsqueda por nombre** de episodio
- **Detalle completo** mostrando fecha de emisión, código y lista de personajes
- **Navegación bidireccional** desde episodio → personaje → episodios del personaje

### ❤️ Favoritos
- **Marcar/desmarcar** personajes como favoritos
- **Persistencia** con localStorage (los favoritos se guardan entre sesiones)
- **Sección independiente** para ver solo tus personajes favoritos
- **Contador dinámico** visible en todo momento

### 🎨 Experiencia de Usuario
- **Animaciones suaves** y transiciones fluidas
- **Indicadores de carga** (spinners) durante las peticiones
- **Manejo de errores** con mensajes amigables
- **Modal elegante** para detalles sin perder contexto
- **Diseño responsive** que se adapta a móvil, tablet y desktop

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **HTML5** | Estructura semántica de la aplicación |
| **CSS3** | Estilos, animaciones y diseño responsive |
| **JavaScript (ES6+)** | Lógica de la aplicación, peticiones a API |
| **Font Awesome 6** | Iconografía moderna y consistente |
| **Google Fonts (Inter)** | Tipografía legible y profesional |
| **Rick and Morty API** | Fuente de datos oficial |

## 📁 Estructura del Proyecto

```
rickandmorty-explorer/
├── index.html              # Estructura principal de la app
├── css/
│   └── styles.css         # Estilos globales y responsive
├── js/
│   ├── api.js             # Cliente de API con sistema de caché
│   ├── favorites.js       # Gestión de favoritos (localStorage)
│   ├── ui.js              # Renderizado y manipulación del DOM
│   └── app.js             # Lógica principal y control de eventos
└── README.md              # Documentación
```

## 🚀 Uso

- Método 1: Doble clic en `index.html`
- Método 2: Usar un servidor local (recomendado)
    ```bash
    # Con Python 3
    python -m http.server 8000
    
    # Con Node.js (live-server)
    npx live-server
    ```


## 📱 Responsive Design

| Dispositivo | Breakpoint | Características |
|-------------|------------|-----------------|
| **Móvil** | < 768px | Grid 1 columna, navegación apilada |
| **Tablet** | 768px - 1023px | Grid 2-3 columnas, layout optimizado |
| **Desktop** | ≥ 1024px | Grid 4 columnas, filtros en paralelo |

## 🔧 Características Técnicas

### Sistema de Caché
```javascript
// Las peticiones a la API se cachean automáticamente
// para mejorar rendimiento y reducir llamadas repetidas
class RickMortyAPI {
    constructor() {
        this.cache = new Map();
    }
    // ...
}
```

### Persistencia de Favoritos
```javascript
// Los favoritos se guardan automáticamente en localStorage
localStorage.setItem('rickmorty_favorites', JSON.stringify(favorites));
```

### Manejo de Estados
- **Loading states**: Spinners durante peticiones asíncronas
- **Error handling**: Mensajes contextuales con auto-ocultamiento
- **Empty states**: Mensajes claros cuando no hay resultados

## 🎯 Funcionalidades Implementadas

### ✅ Requerimientos del Desafío

| Requerimiento | Estado | Descripción |
|---------------|--------|-------------|
| Listado de personajes | ✅ | Grid con imagen, nombre, estado y especie |
| Búsqueda por nombre | ✅ | Filtro en tiempo real |
| Filtros por estado/especie | ✅ | Selectores combinables |
| Detalle de personaje | ✅ | Modal con información completa y episodios |
| Sección de episodios | ✅ | Listado paginado y buscable |
| Detalle de episodio | ✅ | Muestra fecha, código y personajes |
| Enlace personaje-episodio | ✅ | Navegación bidireccional |
| Paginación | ✅ | Botones Anterior/Siguiente con estado |
| Favoritos con localStorage | ✅ | Persistencia y sección dedicada |
| Manejo de errores | ✅ | Mensajes y spinners de carga |
| Diseño responsive | ✅ | Adaptado a móvil, tablet y desktop |

### 🌟 Extras Implementados
- **Animaciones CSS** (fade-in, hover effects)
- **Sistema de caché** para reducir peticiones a API
- **Contador de favoritos** visible globalmente
- **Cierre de modal** con tecla ESC y clic fuera
- **Lazy loading** en imágenes de personajes

## 🔄 Flujo de Datos

```
Usuario → Evento (click/input) → app.js → api.js → API Rick & Morty
                                            ↓
                                    Datos JSON
                                            ↓
                                    ui.js → Renderizado
                                            ↓
                                    DOM actualizado
```

## 🧪 Pruebas Sugeridas

### Búsquedas
- Buscar `"Rick"` - Debe mostrar todas las variantes
- Buscar `"Morty"` - Filtra personajes relacionados
- Búsqueda sin resultados - Muestra mensaje "No se encontraron personajes"

### Filtros
- Estado `"Vivo"` + Especie `"Humano"` - Combinación de filtros
- Cambiar filtros después de búsqueda - Debe mantener coherencia

### Favoritos
1. Marcar 3 personajes como favoritos
2. Recargar la página - Los favoritos persisten
3. Cambiar a vista de favoritos - Solo muestra los marcados
4. Desmarcar desde vista favoritos - Se actualiza automáticamente

### Episodios
- Buscar `"Pilot"` - Encuentra el episodio S01E01
- Hacer clic en un episodio - Ver lista de personajes
- Hacer clic en un personaje del episodio - Navegar a su detalle

## 📄 Licencia

Este proyecto es de **código abierto** y puede ser utilizado con fines educativos o de desarrollo personal.

## 🙏 Agradecimientos

- [Rick and Morty API](https://rickandmortyapi.com/) - Por proporcionar esta increíble API pública
- [Font Awesome](https://fontawesome.com/) - Por los iconos gratuitos
- [Google Fonts](https://fonts.google.com/) - Por la tipografía Inter

---

<div align="center">
  Hecho con ❤️ como proyecto para el módulo de JS del Máster de Desarrollo Fullstack (Academia Conquer Blocks) 🌀
</div>