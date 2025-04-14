fetch("https://music.is120.ckearl.com/")
	.then((response) => response.json())
	.then((dataObject) => {
		completeSteps(dataObject["data"]);
	});

function completeSteps(dataObject) {
    console.log(dataObject)
}