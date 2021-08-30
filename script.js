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

// set first movie by default
getFilmInfo('mulan', searchInput);

// set movie by title from search input
searchInput.addEventListener('keyup', (e) => {

    if (e.key === 'Enter') {
        showLoader();
        getFilmInfo(e.target.value, e.target);
    }
})


// get information about the movie by request to the server
function getFilmInfo(movieTitle, input) {

    fetch(`https://www.omdbapi.com/?apikey=5de597e0&s=${movieTitle.trim()}*`)
        .then(response => response.json())
        .then(movies => {

            if (!movies.Error) {
                const id = movies.Search[0].imdbID;
                fetch(`https://www.omdbapi.com/?apikey=5de597e0&i=${id}`)
                    .then(response => response.json())
                    .then(movie => {
                        if (movie.Title) {
                            console.log('movie object ->', movie);
                            showMovieCard(movie);
                        }
                    })


            } else {
                console.log('error ->', movies.Error);
                throw new Error(movies.Error);

            }

        })
        .catch((error) => {
            if (error.message === 'Too many results.') {
                showErrorMessage('Please enter the exact title of the movie')
                return;
            }
            showErrorMessage(error.message);
        })
        .finally(() => {
            input.value = '';
        })
}

// show movie card and its info
function showMovieCard(data) {
    movieData.classList.remove('hidden');
    movieError.classList.add('hidden');
    loaderOverlay.classList.remove('loader-overlay--active');
    fillMovieCardWithInfo(data);
}

// fill movie card with info from json
function fillMovieCardWithInfo(data) {
    movieActors.innerText = '';
    movieTitle.innerText = data.Title;
    movieYear.innerText = data.Year;
    movieGenre.innerText = data.Genre;
    moviePlot.innerText = data.Plot;
    movieWriter.innerText = data.Writer;
    movieDirector.innerText = data.Director;

    setMoviesActors(data.Actors);
    // some movies are without posters src
    if (data.Poster === 'N/A') {
        setMoviesPosters('');
        return;
    }
    setMoviesPosters(data.Poster);
}

// show loader
function showLoader() {
    movieData.classList.remove('hidden');
    movieError.classList.add('hidden');
    loaderOverlay.classList.add('loader-overlay--active');
}

// set error message from API response
function showErrorMessage(errorMessage) {
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