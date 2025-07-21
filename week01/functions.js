"use strict";

// oggetto
const movie = {
    title: "Forrest Gump",
    genre: "Drama",
    duration: 142,
}

console.log(movie.title);

// constructor function
function Movie(title, genre, duration) {
    this.title = title;
    this.genre = genre;
    this.duration = duration;
    this.isLong = () => this.duration > 120;
}

let forestGump = new Movie("Forest Gump", "Drama", 142);
let inception = new Movie("Inception", "Sci-Fi", 148);

console.log(forestGump.isLong()); // true
console.log(inception.isLong()); // true
