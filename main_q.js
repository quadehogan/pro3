const spinner = document.getElementById("spinner");

spinner.style.display = "block";


fetch("https://music.is120.ckearl.com/")
	.then((response) => response.json())
	.then((dataObject) => {

        spinner.style.display = "none";
        
		completeSteps(dataObject["data"]);
	});

function completeSteps(dataObject) {
    console.log(dataObject)
    genreSectionDevelopment(dataObject)
}

function genreSectionDevelopment(dataObject){
    let genres = dataObject["spotify_top_genre_artists"];
    console.log(genres);

    for (let genreObject of genres) {
        let name = genreObject.genre_name;
        let genreName = document.getElementById(name)
        genreName.innerHTML = `${name} artists`;
        genreName.style.color = "var(--secondary-color)"
        genreName.style.fontSize = "1.5rem"

        let artists = genreObject["artists"]
        for (let artistIndex in artists) {
            artist = artists[artistIndex];
            let artistNameSection = document.createElement("div")
            let artistName = document.createElement("p")
            let artistImage = document.createElement("img")
            let spotifyURL = artist.spotify_url
            let spotifyLink = document.createElement("a")

            artistName.innerHTML = artist.name
            artistNameSection.appendChild(artistName)

            artistImage.src = artist.image
            artistImage.alt = `${artist.name}_image`
            artistImage.classList.add("artist_image")
            artistImage.classList.add("hover")

            spotifyLink.href = spotifyURL
            spotifyLink.target = "_blank"
            spotifyLink.appendChild(artistImage)

            artistNameSection.appendChild(spotifyLink)
            artistNameSection.style.borderRadius = "0.5rem"
            artistNameSection.style.margin = "1rem"
            artistNameSection.style.marginTop = "0.3rem"
            artistNameSection.style.display = "flex"
            artistNameSection.style.flexDirection = "column"
            artistNameSection.style.backgroundColor = "var(--main-color-sl)"
            artistNameSection.style.padding = "1rem"

            artistName.style.color = "var(--main-color-sl)"
            artistName.style.alignSelf = "center"
            artistName.style.color = "var(--secondary-color)"
            artistName.style.fontSize = "1.1rem"
            artistName.style.paddingTop = "0.1rem"
            artistName.style.marginTop = "0.1rem"

            let artistsSections = document.getElementById(`${name}_artists`)
            artistsSections.appendChild(artistNameSection)
        }
    }
}