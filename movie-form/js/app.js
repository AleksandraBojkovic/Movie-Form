const dataModule = (function () {

    const data = {
        movies: [],
        programs: []
    }

    function getFormattedDate(date) {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }

    function Genre(name) {
        this.name = name;
    }

    function createGenre(genre) {
        return new Genre(genre);
    }

    Genre.prototype.getData = function () {
        const genre = this.name;
        return (genre.charAt(0) + genre.charAt(genre.length - 1)).toUpperCase();
    }

    function Movie(title, genre, length) {
        this.title = title;
        this.genre = genre;
        this.length = length;
    }

    Movie.prototype.getData = function () {
        return `${this.title}, ${this.length}min, ${this.genre.getData()}`
    }

    function createMovie(title, genre, length) {
        return new Movie(title, genre, length);
    }

    function addMovieToData(movieObj) {
        data.movies.push(movieObj);
    }

    function Program(date) {
        this.date = date;
        this.listOfMovies = [];
    }

    Program.prototype.addMovie = function (movie) {
        this.listOfMovies.push(movie);
    }

    Program.prototype.numberOfMovies = function () {
        return this.listOfMovies.length;
    }

    Program.prototype.getTotalMovieLength = function () {
        return this.listOfMovies.reduce(function (acc, cur) {
            return acc + parseInt(cur.length);
        }, 0);
    }

    Program.prototype.getData = function () {
        const date = getFormattedDate(this.date);
        const totalMovieLength = this.getTotalMovieLength();

        if (this.listOfMovies.length === 0) {
            return `${date}, program duration: TBA`;
        }
        else {
            return `${date}, ${this.listOfMovies.length} movies, program duration: ${totalMovieLength}min\n`;
        }
    }

    function createProgram(date) {
        return new Program(date);
    }

    function addProgramToData(porgramObj) {
        data.programs.push(porgramObj);
    }

    return {
        data: data,
        createGenre: createGenre,
        createMovie: createMovie,
        addMovieToData: addMovieToData,
        createProgram: createProgram,
        addProgramToData: addProgramToData,
    }
})();

const uiModule = (function () {

    const $title = document.querySelector('#title');
    const $length = document.querySelector('#length');
    const $genre = document.querySelector('#genre');
    const $date = document.querySelector('#program-date');
    const $movieSelect = document.querySelector('#movie-select');
    const $programSelect = document.querySelector('#program-select');

    const $movieList = document.querySelector('#created-movies');
    const $programList = document.querySelector('#created-programs');

    function collectMovieInput() {
        const title = $title.value;
        const length = parseInt($length.value);
        const genre = $genre.value;

        return {
            title: title,
            length: length,
            genre: genre
        }
    }

    function collectProgramInput() {
        const date = $date.value;

        return {
            date: date
        }
    }

    function collectMovieAndProgramIndexes() {
        const movieIndex = $movieSelect.value;
        const programIndex = $programSelect.value;

        return {
            movieIndex: movieIndex,
            programIndex: programIndex,
        }
    }

    function displayMovie(data) {
        let movieInfo = '';
        $movieSelect.innerHTML = '<option value="" disabled selected>Choose movie</option>'

        for (let i = 0; i < data.movies.length; i++) {

            movieInfo += `<li>${data.movies[i].getData()}</li>`;

            let movieSelectOption = document.createElement('option');
            movieSelectOption.value = i;
            movieSelectOption.innerHTML = data.movies[i].title;
            $movieSelect.appendChild(movieSelectOption);
        }

        $movieList.innerHTML = movieInfo;

        $title.value = '';
        $length.value = '';
    }

    function displayProgram(data) {
        let programInfo = '';

        $programSelect.innerHTML = '<option value="" disabled selected>Choose program</option>';

        for (let i = 0; i < data.programs.length; i++) {
            programInfo += `<li>${data.programs[i].getData()}</li>`;

            let programSelectOption = document.createElement('option');
            programSelectOption.value = i;
            programSelectOption.innerHTML = data.programs[i].getData();

            $programSelect.appendChild(programSelectOption);

        }
        $programList.innerHTML = programInfo;
    }

    function resetForm(form) {
        form.reset();
    }

    return {
        collectMovieInput: collectMovieInput,
        collectProgramInput: collectProgramInput,
        collectMovieAndProgramIndexes: collectMovieAndProgramIndexes,
        displayMovie: displayMovie,
        displayProgram: displayProgram,
        resetForm: resetForm
    }
})();

const controller = (function (data, ui) {

    function init() {
        setupEventListeners();
    }

    // setup event listeners
    function setupEventListeners() {
        const $createMovieButton = document.querySelector('#create-movie');
        const $createProgramButton = document.querySelector('#create-program');
        const $addMovie = document.querySelector('#add-movie');

        $createMovieButton.addEventListener('click', onCreateMovieHandler);
        $createProgramButton.addEventListener('click', onCreateProgramHandler);
        $addMovie.addEventListener('click', onAddMovieHandler);
    }

    // error fields
    const $movieError = document.querySelector('#movie-error');
    const $programError = document.querySelector('#program-error');
    const $assignError = document.querySelector('#assign-error');



    function onCreateMovieHandler(event) {

        event.preventDefault();

        // collect movie data
        const movieObj = ui.collectMovieInput();
        const { title, genre, length } = movieObj;

        // validate data and create movie
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
                $movieError.innerHTML = '';

                const genreObj = data.createGenre(genre);
                const movieInstance = data.createMovie(title, genreObj, length);
                data.addMovieToData(movieInstance);

                // reset form
                ui.resetForm(document.querySelector('.movie-form'));
            }

        } catch (error) {
            $movieError.innerHTML = error.message;
        }

        // display
        ui.displayMovie(data.data);
    };

    function onCreateProgramHandler(event) {

        event.preventDefault();

        // collect program data
        const programObj = ui.collectProgramInput();
        const { date } = programObj;

        // validate data and create program
        try {
            if (!date) {
                throw new Error('Select date!')
            } else {
                $programError.innerHTML = '';

                const dateObj = new Date(date);
                const program = data.createProgram(dateObj);
                data.addProgramToData(program);
            }

        } catch (error) {
            $programError.innerHTML = error.message;
        }

        // display
        ui.displayProgram(data.data);

        // reset form
        // ui.resetForm(document.querySelector('.movie-form'));
    };

    function onAddMovieHandler(event) {
        // prevents page reload
        event.preventDefault();

        // collect 
        const indexObj = ui.collectMovieAndProgramIndexes();
        const { movieIndex, programIndex } = indexObj;
        const movie = data.data.movies[movieIndex];
        const program = data.data.programs[programIndex];

        // validate and create
        $assignError.innerHTML = '';

        try {
            if (!movieIndex || !programIndex) {
                throw new Error('All fields required!')
            }
            else {
                program.addMovie(movie);
            }
        }
        catch (error) {
            $assignError.innerHTML = error.message;
        }

        // display
        ui.displayProgram(data.data);

        // reset form
        ui.resetForm(document.querySelector('.movie-form'));
    };

    return {
        init: init
    }
})(dataModule, uiModule);
