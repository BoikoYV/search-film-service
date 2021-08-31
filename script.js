const movieCard = document.getElementById('movie-card');
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
const moviePosterFill = document.querySelector('.movie__poster--fill'); //blur poster
const moviePosterFeatured = document.querySelector('.movie__poster--featured'); //small poster

// get showMovieWithInfo function without call in variable for listener
const movieWithInfoHandler = debounce(showMovieWithInfo, 1000);


// set first movie by default
getMovieInfo('mulan', searchInput);

// set movie by title from search input
searchInput.addEventListener('keyup', movieWithInfoHandler)


// get value from search input after delay -> use showMovieWithInfo callback
function debounce(fn, ms) {
    let timeout;
    return function () {
        showLoader();
        const fnCall = () => { fn.apply(this, arguments) }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    };
}

// callback for debounce -> show movie card
function showMovieWithInfo(elem) {

    showLoader();
    getMovieInfo(elem.target.value, elem.target);

}

// get information about the movie by request to the server
function getMovieInfo(movieTitle, input) {

    showLoader();
    fetch(`https://www.omdbapi.com/?apikey=5de597e0&s=${movieTitle.trim()}*`)
        .then(response => response.json())
        .then(movies => {

            if (!movies.Error) {
                const id = movies.Search[0].imdbID;
                fetch(`https://www.omdbapi.com/?apikey=5de597e0&i=${id}`)
                    .then(response => response.json())
                    .then((data) => {
                        // some movies don't have src'
                        if (data.Poster === 'N/A') {
                            return createMoviesPosters(data, '');

                        } else {
                            // function return promise with data for next chain element
                            // when poster images loaded  -> text info will be filled
                            return createMoviesPosters(data, data.Poster)
                        }
                    })
                    .then(movie => {
                        if (movie.Title) {
                            console.log('movie object ->', movie);
                            showMovieWithInfoCard(movie);
                            // clean input when movie info will be on the page
                            input.value = '';
                        }
                    })


            } else {
                console.log('error ->', movies.Error);
                input.value = '';
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
}

// show movie card and its info
function showMovieWithInfoCard(data) {
    movieData.classList.remove('hidden');
    movieError.classList.add('hidden');
    movieCard.classList.remove('skeleton-loader');
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
}

// show loader with skeleton
function showLoader() {
    cleanMovieInfoInCard();
    movieError.classList.add('hidden');
    movieCard.classList.add('skeleton-loader');
}

// set error message from API response
function showErrorMessage(errorMessage) {
    movieErrorTitle.innerText = errorMessage;

    movieData.classList.add('hidden');
    movieError.classList.remove('hidden');
    movieCard.classList.remove('skeleton-loader');
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

// create img posters with new src with onload event
function createMoviesPosters(data, posterSrc) {

    return new Promise(function (resolve) {

        const smallPoster = document.createElement('img');
        const bigBlurPoster = document.createElement('img');

        smallPoster.src = posterSrc;
        bigBlurPoster.src = posterSrc;

        moviePosterFill.append(smallPoster);
        moviePosterFeatured.append(bigBlurPoster);
        // the same image 

        smallPoster.addEventListener('load', function () {
            // return object with data for next chain (then)
            resolve(data);
        });

    });

    // const smallPoster = document.createElement('img');
    // const bigBlurPoster = document.createElement('img');

    // smallPoster.src = posterSrc;
    // bigBlurPoster.src = posterSrc;

    // moviePosterFill.append(smallPoster);
    // moviePosterFeatured.append(bigBlurPoster);
}

//remove posters images because of broken img icon when page is Loading
function removeMoviesPosters() {
    moviePosterFill.innerHTML = '';
    moviePosterFeatured.innerHTML = '';
}

// remove all movie info including posters images
function cleanMovieInfoInCard() {
    movieActors.innerText = '';
    movieTitle.innerText = '';
    movieYear.innerText = '';
    movieGenre.innerText = '';
    moviePlot.innerText = '';
    movieWriter.innerText = '';
    movieDirector.innerText = '';
    removeMoviesPosters();
}