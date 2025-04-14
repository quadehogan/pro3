// Function to fetch data from the API
async function fetchMusicData() {
    try {
        const response = await fetch('https://music.is120.ckearl.com');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// State for view, pagination, filters, and search
let isCardView = true;
let currentPage = 1;
const itemsPerPage = 48;
let allSongs = [];
let filteredSongs = [];
let selectedGenre = 'all';
let selectedArtist = 'all';
let searchTerm = ''; // New state for search term

// Function to create a card (grid view)
function createCard(song, artistName, genreName, albumName) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <h2>${song.name || 'Unknown Song'}</h2>
        <p><strong>Artist:</strong> ${artistName || 'Unknown Artist'}</p>
        <p class="genre"><strong>Genre:</strong> ${genreName || 'Unknown Genre'}</p>
        <p><strong>Album:</strong> ${albumName || 'Unknown Album'}</p>
        <p><strong>Duration:</strong> ${Math.floor(song.duration_ms / 1000) || 'Unknown'} seconds</p>
    `;
    return card;
}

// Function to create a row (compact view)
function createRow(song, artistName, genreName, albumName) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `
        <div>${song.name || 'Unknown Song'}</div>
        <div>${artistName || 'Unknown Artist'}</div>
        <div class="genre">${genreName || 'Unknown Genre'}</div>
        <div>${albumName || 'Unknown Album'}</div>
        <div>${Math.floor(song.duration_ms / 1000) || 'Unknown'}s</div>
    `;
    return row;
}

// Function to render items (cards or rows) based on current view, page, filters, and search
function renderItems() {
    const container = document.getElementById('card-container');
    container.className = isCardView ? 'card-container card-view' : 'card-container row-view';
    container.innerHTML = '';

    // Apply filters
    filteredSongs = allSongs;

    // Filter by search term (case-insensitive)
    if (searchTerm.trim() !== '') {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredSongs = filteredSongs.filter(song =>
            song.genreName.toLowerCase().includes(lowerSearchTerm) ||
            song.artistName.toLowerCase().includes(lowerSearchTerm) ||
            song.albumName.toLowerCase().includes(lowerSearchTerm)
        );
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
        filteredSongs = filteredSongs.filter(song => song.genreName.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Filter by artist
    if (selectedArtist !== 'all') {
        filteredSongs = filteredSongs.filter(song => song.artistName.toLowerCase() === selectedArtist.toLowerCase());
    }

    // Calculate pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedSongs = filteredSongs.slice(start, end);

    // Render items
    paginatedSongs.forEach(song => {
        const item = isCardView
            ? createCard(song.song, song.artistName, song.genreName, song.albumName)
            : createRow(song.song, song.artistName, song.genreName, song.albumName);
        container.appendChild(item);
    });

    // Update pagination info
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    document.getElementById('page-info-top').textContent = `Page ${currentPage} of ${totalPages || 1}`;
    document.getElementById('page-info-bottom').textContent = `Page ${currentPage} of ${totalPages || 1}`;

    // Update button states
    document.getElementById('prev-page-top').disabled = currentPage === 1;
    document.getElementById('prev-page-bottom').disabled = currentPage === 1;
    document.getElementById('next-page-top').disabled = currentPage === totalPages || totalPages === 0;
    document.getElementById('next-page-bottom').disabled = currentPage === totalPages || totalPages === 0;

    // If no items after filtering
    if (filteredSongs.length === 0) {
        container.innerHTML = '<p>No songs found for these filters or search.</p>';
    }
}

// Function to populate the genre filter dropdown
function populateGenreFilter(genres) {
    const genreFilter = document.getElementById('genre-filter');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.toLowerCase();
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// Function to populate the artist filter dropdown based on the selected genre and search term
function populateArtistFilter() {
    const artistFilter = document.getElementById('artist-filter');
    artistFilter.innerHTML = '<option value="all">All Artists</option>'; // Reset options

    // Get artists based on the current genre filter and search term
    let artistsToShow = allSongs;
    if (selectedGenre !== 'all') {
        artistsToShow = artistsToShow.filter(song => song.genreName.toLowerCase() === selectedGenre.toLowerCase());
    }
    if (searchTerm.trim() !== '') {
        const lowerSearchTerm = searchTerm.toLowerCase();
        artistsToShow = artistsToShow.filter(song =>
            song.genreName.toLowerCase().includes(lowerSearchTerm) ||
            song.artistName.toLowerCase().includes(lowerSearchTerm) ||
            song.albumName.toLowerCase().includes(lowerSearchTerm)
        );
    }

    // Extract unique artists
    const uniqueArtists = [...new Set(artistsToShow.map(song => song.artistName))].sort();
    uniqueArtists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist.toLowerCase();
        option.textContent = artist;
        artistFilter.appendChild(option);
    });
}

// Function to populate songs, genres, and artists
async function populateSongs() {
    const musicData = await fetchMusicData();

    // Check if musicData is valid
    if (!musicData || !musicData.data || !musicData.data.spotify_top_genre_artists) {
        document.getElementById('card-container').innerHTML = '<p>No music data available.</p>';
        return;
    }

    // Extract genres and songs
    const genres = musicData.data.spotify_top_genre_artists;
    if (!Array.isArray(genres)) {
        document.getElementById('card-container').innerHTML = '<p>No valid music data to display.</p>';
        return;
    }

    // Collect unique genres
    const uniqueGenres = [...new Set(genres.map(genre => genre.genre_name))];
    populateGenreFilter(uniqueGenres);

    // Extract songs
    allSongs = [];
    genres.forEach(genre => {
        const genreName = genre.genre_name;
        const artists = genre.artists || [];

        artists.forEach(artist => {
            const artistName = artist.name || 'Unknown Artist';
            const albums = artist.albums || [];

            albums.forEach(album => {
                const albumName = album.name || 'Unknown Album';
                const songs = album.songs || [];

                songs.forEach(song => {
                    allSongs.push({
                        song,
                        artistName,
                        genreName,
                        albumName
                    });
                });
            });
        });
    });

    if (allSongs.length === 0) {
        document.getElementById('card-container').innerHTML = '<p>No songs found to display.</p>';
        return;
    }

    // Populate artist filter initially
    populateArtistFilter();

    // Initial render
    renderItems();
}

// Toggle view
document.getElementById('toggle-view').addEventListener('click', () => {
    isCardView = !isCardView;
    document.getElementById('toggle-view').textContent = isCardView ? 'Switch to Row View' : 'Switch to Card View';
    renderItems();
});

// Genre filter
document.getElementById('genre-filter').addEventListener('change', (e) => {
    selectedGenre = e.target.value;
    selectedArtist = 'all'; // Reset artist filter when genre changes
    document.getElementById('artist-filter').value = 'all'; // Reset artist dropdown
    currentPage = 1; // Reset to first page
    populateArtistFilter(); // Update artist options
    renderItems();
});

// Artist filter
document.getElementById('artist-filter').addEventListener('change', (e) => {
    selectedArtist = e.target.value;
    currentPage = 1; // Reset to first page
    renderItems();
});

// Search bar
document.getElementById('search-bar').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    selectedGenre = 'all'; // Reset genre filter
    selectedArtist = 'all'; // Reset artist filter
    document.getElementById('genre-filter').value = 'all'; // Reset genre dropdown
    document.getElementById('artist-filter').value = 'all'; // Reset artist dropdown
    currentPage = 1; // Reset to first page
    populateArtistFilter(); // Update artist options
    renderItems();
});

// Pagination event listeners
document.getElementById('prev-page-top').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderItems();
    }
});
document.getElementById('next-page-top').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderItems();
    }
});
document.getElementById('prev-page-bottom').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderItems();
    }
});
document.getElementById('next-page-bottom').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderItems();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, fetching data...');
    populateSongs();
});