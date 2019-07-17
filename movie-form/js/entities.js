function getFormattedDate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function Genre(name) {
    this.name = name;
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
