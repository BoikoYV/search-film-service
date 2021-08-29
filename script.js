const searchInput = document.getElementById('movie-search');
const movieTitle = document.querySelector('.movie__title');
const movieYear = document.querySelector('.movie__year');
const movieGenre = document.querySelector('.movie__genre');
const moviePlot = document.querySelector('.movie__plot');
const movieWriter = document.querySelector('.movie__writer');
const movieDirector = document.querySelector('.movie__director');
const movieActors = document.querySelector('.movie__actors');
const moviePosters = document.querySelectorAll('.movie__poster img');
const movieErrorTitle = document.querySelector('.movie__error-title');
const movieData = document.querySelector('.movie__data');
const movieError = document.querySelector('.movie__error');
const loaderOverlay = document.querySelector('.loader-overlay');


searchInput.addEventListener('keyup', (e) => {

    if (e.key === 'Enter') {

        showLoader();

        fetch(`http://www.omdbapi.com/?apikey=5de597e0&t=${e.target.value}`)

            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.Title) {

                    console.log('movie object ->', data);
                    showMovieCard();

                    movieActors.innerText = '';
                    movieTitle.innerText = data.Title;
                    movieYear.innerText = data.Year;
                    movieGenre.innerText = data.Genre;
                    moviePlot.innerText = data.Plot;
                    movieWriter.innerText = data.Writer;
                    movieDirector.innerText = data.Director;
                    setMoviesActors(data.Actors);
                    setMoviesPosters(data.Poster);
                }
                else {
                    console.log('error ->', data.Error);
                    throw new Error(data.Error);
                }
            })

            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                e.target.value = '';
            });
    }
})

// show movie card 
function showMovieCard() {
    movieData.classList.remove('hidden');
    movieError.classList.add('hidden');
    loaderOverlay.classList.remove('loader-overlay--active');
}
// show loader
function showLoader() {
    movieData.classList.remove('hidden');
    movieError.classList.add('hidden');
    loaderOverlay.classList.add('loader-overlay--active');
}

// set error message from API response
function setErrorMessage(errorMessage) {
    movieErrorTitle.innerText = errorMessage;
    movieData.classList.add('hidden');
    movieError.classList.remove('hidden');
    loaderOverlay.classList.remove('loader-overlay--active');
}

// set actors into the list
function setMoviesActors(actorsStr) {
    const actorsArr = actorsStr.split(', ');
    actorsArr.forEach(actor => {
        const actorEl = document.createElement('li');
        actorEl.innerText = actor;

        movieActors.append(actorEl);
    })
}

// set new src to posters images
function setMoviesPosters(posterSrc) {
    return moviePosters.forEach(poster => {
        poster.src = posterSrc;
    })
}