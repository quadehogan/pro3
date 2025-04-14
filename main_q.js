fetch("https://music.is120.ckearl.com/")
	.then((response) => response.json())
	.then((dataObject) => {
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
        document.getElementById(name).innerHTML = name;

        let artists = genreObject["artists"]
        for (let artistIndex in artists) {
            artist = artists[artistIndex];
            console.log(artist.name)
        }
    }
}