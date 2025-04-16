// spinner
const spinner = document.getElementById("spinner");

spinner.style.display = "block";

// api retrevial
fetch("https://music.is120.ckearl.com/")
	.then((response) => response.json())
	.then((dataObject) => {

        // stop spinner
        spinner.style.display = "none";

        // run code
		completeSteps(dataObject["data"]);
});

// Dark Mode Var
let isDarkMode = false;

// Dark Mode Function
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('toggle-dark-mode').textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
}

document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

// Run other Functions
function completeSteps(dataObject) {
    genreSectionDevelopment(dataObject)
}

// Set Up Rows of Artists
function genreSectionDevelopment(dataObject){
    // Retreive Array of Genres 
    let genres = dataObject["spotify_top_genre_artists"];

    // Iterate over 
    for (let genreObject of genres) {
        // Set up Artists for each Genre
        let name = genreObject.genre_name;
        let genreName = document.getElementById(name)
        let navigation = document.getElementById("navigation")
        let navlink = document.createElement("a")

        genreName.innerHTML = `${name} artists`;
        genreName.style.color = "var(--secondary-color)";
        genreName.style.fontSize = "1.5rem";

        navlink.innerHTML = name;
        navlink.href = `#${name}`;
        navlink.style.textDecoration = "none";
        if (navlink.innerHTML != "metal"){
            navlink.style.borderRight = "1px solid var(--secondary-color)";
        }
        navlink.style.marginBottom = "0.5rem";
        navlink.style.paddingRight = "3rem";
        if (navlink.innerHTML === "pop"){
            navlink.style.paddingLeft = "3rem";
        }
        navlink.classList.add("text_hover");
        navigation.appendChild(navlink)

        // Declare Section
        let artistsSections = document.getElementById(`${name}_artists`)

        // Get all artists per genre
        let artists = genreObject["artists"]
        // Iterate 
        for (let artistIndex in artists) {
            // Get Name
            artist = artists[artistIndex];
            // Set up Cards
            let artistNameSection = document.createElement("div")
            let artistName = document.createElement("p")
            let artistImage = document.createElement("img")
            let spotifyURL = artist.spotify_url
            let spotifyLink = document.createElement("a")

            // Set Name
            artistName.innerHTML = artist.name
            artistNameSection.appendChild(artistName)

            // Set Image
            artistImage.src = artist.image
            artistImage.alt = `${artist.name}_image`
            artistImage.classList.add("artist_image")
            artistImage.classList.add("hover")

            // Make Image a link to their spotify
            spotifyLink.href = spotifyURL
            spotifyLink.target = "_blank"
            spotifyLink.appendChild(artistImage)

            // Set Up Card styles
            artistNameSection.appendChild(spotifyLink)
            artistNameSection.style.borderRadius = "0.5rem"
            artistNameSection.style.margin = "1rem"
            artistNameSection.style.marginTop = "0.3rem"
            artistNameSection.style.display = "flex"
            artistNameSection.style.flexDirection = "column"
            artistNameSection.style.backgroundColor = "var(--main-color-sl)"
            artistNameSection.style.padding = "1rem"

            // Style Name
            artistName.style.color = "var(--main-color-sl)"
            artistName.style.alignSelf = "center"
            artistName.style.color = "var(--secondary-color)"
            artistName.style.fontSize = "1.1rem"
            artistName.style.paddingTop = "0.1rem"
            artistName.style.marginTop = "0.1rem"

            // Add Card to Section
            artistsSections.appendChild(artistNameSection)
        }
    }
}