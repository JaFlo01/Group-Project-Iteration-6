const express = require("express");
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  let songs = [
    {
      cover: "images/for-all-the-dogs.png",
      title: "IDGAF",
      artists: "Drake, Yeat",
    },
    {
      cover: "images/set-if-off.jpg",
      title: "SAY MY GRACE (feat. Travis Scott)",
      artists: "Offset, Travis Scott",
    },
    {
      cover: "images/Travis_Scott_-_Utopia.png",
      title: "MELTDOWN (feat. Drake)",
      artists: "Travis Scott, Drake",
    },
    {
      cover: "images/to-the-bank.jpg",
      title: "To The Bank",
      artists: "Lil Wayne, Cool & Dre",
    },
    {
      cover: "images/rap-saved-me.png",
      title: "Rap Saved Me (feat. Quavo)",
      artists: "21 Savage, Offset, Metro Boomin, Quavo",
    },
    {
      cover: "images/superheroes.png",
      title: "Superhero (Heroes & Villains) [with Future & Chris Brown]",
      artists: "Metro Boomin, Future, Chris Brown",
    },
    {
      cover: "images/Eminem_Rap_God.png",
      title: "Rap God",
      artists: "Eminem",
    },
    {
      cover: "images/TheOff-Season.jpeg",
      title: "amari",
      artists: "J. Cole",
    },
    {
      cover: "images/The_life_of_pablo_alternate.jpg",
      title: "Father Stretch My Hands Pt. 1",
      artists: "Kanye West",
    },
    {
      cover: "images/whole.jpeg",
      title: "Sky",
      artists: "Playboi Carti",
    },
  ];

  let playlists = [
    {
      cover: "images/playlist-1.jpg",
      title: "PLAYLIST 1",
    },
    {
      cover: "images/playlist-2.jpg",
      title: "PLAYLIST 2",
    },
    {
      cover: "images/playlist-10.jpg",
      title: "PLAYLIST 3",
    },
    {
      cover: "images/playlist-3.jpg",
      title: "PLAYLIST 4",
    },
    {
      cover: "images/playlist-4.jpg",
      title: "PLAYLIST 5",
    },
    {
      cover: "images/playlist-5.jpg",
      title: "PLAYLIST 6",
    },
    {
      cover: "images/playlist-6.jpg",
      title: "PLAYLIST 7",
    },
    {
      cover: "images/playlist-7.jpg",
      title: "PLAYLIST 8",
    },
    {
      cover: "images/playlist-8.jpg",
      title: "PLAYLIST 9",
    },
    {
      cover: "images/playlist-9.jpg",
      title: "PLAYLIST 10",
    },
  ];

  let previousSongs = [
    {
      cover: "images/lean-wit-me.jpg",
      title: "Lean Wit Me",
      artists: "Juice WRLD",
    },
    {
      cover: "images/look-at-me.jpg",
      title: "Look At Me!",
      artists: "XXXTENTACION",
    },
    {
      cover: "images/the-grinch.jpeg",
      title: "The Grinch",
      artists: "Trippie Redd",
    },
    {
      cover: "images/flex-up.jpg",
      title: "Flex Up (feat. Future & Playboi Carti)",
      artists: "Lil Yachty, Future, Playboi Carti",
    },
    {
      cover: "images/church-in-the-wild.jpeg",
      title: "No Church In The Wild",
      artists: "JAY-Z, Kanye West,Frank Ocean, The-Dream",
    },
    {
      cover: "images/n95.jpg",
      title: "N95",
      artists: "Kendrick Lamar",
    },
  ];

  const deleteSong = "fa-solid fa-trash";
  const addSong = "fa-solid fa-plus";

  res.render("pages/dj", {
    songs: songs,
    playlists: playlists,
    previousSongs: previousSongs,
    deleteSong: deleteSong,
    addSong: addSong,
  });
});

app.get("/producer", function (req, res) {
  res.render("pages/producer");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
