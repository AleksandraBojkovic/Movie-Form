const $createMovieButton = document.getElementById('create-movie');
const $createProgramButton = document.querySelector('#create-program');
const $addMovie = document.querySelector('#add-movie');
const $title = document.querySelector('#title');
const $length = document.querySelector('#length');
const $genre = document.querySelector('#genre');
const $movieList = document.querySelector('#created-movies');
const $movieError = document.querySelector('#movie-error');
const $assignError = document.querySelector('#assign-error');

const $movieSelect = document.querySelector('#movie-select');
const $programSelect = document.querySelector('#program-select');
const $programList = document.querySelector('#created-programs');

const movies = [];
const programs = [];

$createMovieButton.addEventListener('click', createMovie);
$createProgramButton.addEventListener('click', createProgram);
$addMovie.addEventListener('click', addMovieToProgram);


function createMovie(event) {
    event.preventDefault();

    const title = $title.value;
    const length = parseInt($length.value);
    const genre = $genre.value;
    const genreObj = new Genre(genre);

    try {
        if (title === '') {
            throw new Error('Enter title.')
        }
        if (isNaN(length)) {
            throw new Error('Enter length.')
        }
        if (genre === '') {
            throw new Error('Select genre.')
        }
        else {
            const movie = new Movie(title, genreObj, length);
            movies.push(movie);

            let movieInfo = '';
            $movieSelect.innerHTML = '<option value="" disabled selected>Choose movie</option>'

            for (let i = 0; i < movies.length; i++) {

                movieInfo += `<li>${movies[i].getData()}</li>`;

                let movieSelectOption = document.createElement('option');
                movieSelectOption.value = i;
                movieSelectOption.innerHTML = movies[i].title;
                $movieSelect.appendChild(movieSelectOption);
            }

            $movieList.innerHTML = movieInfo;

            $title.value = '';
            $length.value = '';
        }

    } catch (error) {
        $movieError.innerHTML = error.message;
    }


}

function createProgram(event) {
    event.preventDefault();

    const $date = document.querySelector('#program-date');

    document.querySelector('#program-error').innerHTML = '';  

    try { 
        if (!$date.value) {
            throw new Error('Select date!')
        } else {
            const dateObj = new Date($date.value);
            const program = new Program(dateObj);
            programs.push(program);
        
            let programInfo = '';
        
            $programSelect.innerHTML = '<option value="" disabled selected>Choose program</option>';
        
            for (let i = 0; i < programs.length; i++) {
                programInfo += `<li>${programs[i].getData()}</li>`;
        
                let programSelectOption = document.createElement('option');
                programSelectOption.value = i;
                programSelectOption.innerHTML = programs[i].getData();
        
                $programSelect.appendChild(programSelectOption);
        
            }
            $programList.innerHTML = programInfo;
        }
        
    } catch (error) {
        document.querySelector('#program-error').innerHTML = error.message;
    }

}

function addMovieToProgram(event) {
    event.preventDefault();

    const movieIndex = $movieSelect.value;
    console.log(typeof movieIndex)
    const programIndex = $programSelect.value;
    console.log(programIndex)

    const movie = movies[movieIndex];
    const program = programs[programIndex];

    $assignError.innerHTML = '';

    try {
        if (program.listOfMovies.length >= 4) {
            throw {
                name: 'Movie length',
                message: 'Movie limit per program is 4.'
            }
        }
        if ((program.getTotalMovieLength() + movie.length) > 480) {
            throw {
                name: 'Program length',
                message: 'Program duration limit is 8 hours.'
            }
        }
        if (!movieIndex && !programIndex) {
            //TD not working
            throw {
                name: 'Fields',
                message: 'All fields required.'
            }
        }
        else {
            program.addMovie(movie);
            updateProgramList();
        }
    }
    catch (error) {
        if (error.name === 'Movie length') {
            $assignError.innerHTML = error.message;
        }
        else if (error.name === 'Program length') {
            $assignError.innerHTML = error.message;
        }
        else if (error.name === 'Fields') {
            $assignError.innerHTML = error.message;
        }

    }
}

function updateProgramList() {
    let programInfo = '';

    $programSelect.innerHTML = '<option value="" disabled selected>Choose program</option>';

    for (let i = 0; i < programs.length; i++) {
        programInfo += `<li>${programs[i].getData()}</li>`;

        let programSelectOption = document.createElement('option');
        programSelectOption.value = i;
        programSelectOption.innerHTML = programs[i].getData();

        $programSelect.appendChild(programSelectOption);

    }
    $programList.innerHTML = programInfo;
}