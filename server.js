const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const port = 8080;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/radioStationDB");
  console.log("Connected to DB");

  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.json());
  app.use(
    session({
      secret: "DJ952",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1800000, //If inactivity exceeds this amount, clear the session
        sameSite: "session", //If browser is closed, clear the session
      },
    })
  );

  //Stores user's username
  const usernameSchema = new mongoose.Schema({
    username: String,
  });

  const Username = mongoose.model("Username", usernameSchema);

  const user = new Username({
    username: "User",
  });

  await user.save();

  //Stores the initial songs in the current playlist
  const songSchema = new mongoose.Schema({
    cover: String,
    title: String,
    artists: String,
  });

  const Song = mongoose.model("Song", songSchema);

  const songs = [
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

  //Prevents duplication of songs whenever we run the server multiple times
  const alreadyDocumented = await Song.find({});
  if (alreadyDocumented.length === 0) {
    for (const currentSong of songs) {
      const newSong = new Song(currentSong);
      await newSong.save();
    }
  }

  //Stores previous playlists
  const playlistSchema = new mongoose.Schema({
    cover: String,
    title: String,
  });

  const Playlist = mongoose.model("Playlist", playlistSchema);

  const playlists = [
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

  //Prevents duplication of playlists when running the server multiple times
  const playlistDocumented = await Playlist.find({});
  if (playlistDocumented.length === 0) {
    for (const currentPlaylist of playlists) {
      const newPlaylist = new Playlist(currentPlaylist);
      await newPlaylist.save();
    }
  }

  // Stores previous playlist songs
  const prevSongSchema = new mongoose.Schema({
    cover: String,
    title: String,
    artists: String,
  });

  const prevSong = mongoose.model("prevSong", prevSongSchema);

  const previousSongs = [
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

  //Prevents duplication of previous songs when server is run mulitple times
  const prevSongDocumented = await prevSong.find({});
  if (prevSongDocumented.length === 0) {
    for (const currentSong of previousSongs) {
      const newSong = new prevSong(currentSong);
      await newSong.save();
    }
  }

  //Current page / DJ page
  app.get("/", async function (req, res) {
    try {
      //Read the values from the database and store them into the fields within res.render
      const songs = await Song.find({});
      const prevSongs = await prevSong.find({});
      const user = await Username.findOne({});
      const deleteSong = "fa-solid fa-trash";
      const addSong = "fa-solid fa-plus";
      const playSong = "fa-solid fa-play";
      const pauseSong = "fa-solid fa-pause";
      const userPlaylist = req.session.playlist || [];

      res.render("pages/dj", {
        songs: songs,
        playlists: playlists,
        previousSongs: previousSongs,
        deleteSong: deleteSong,
        addSong: addSong,
        playSong: playSong,
        pauseSong: pauseSong,
        username: user.username,
        userPlaylist: userPlaylist,
      });
    } catch (err) {
      console.log(err);
      alert("Error retrieving data.");
    }
  });

  //Create operation of CRUD.
  //We're essentially creating a new song to the current playlist whenever we add it from a previous playlist
  //When it gets added, a new song document is created and saved into the Song collection
  app.post("/add-song", async function (req, res) {
    const { cover, title, artists } = req.body;

    try {
      const newSong = new Song({
        cover: cover,
        title: title,
        artists: artists,
      });

      await newSong.save();
      res.status(200).json({ message: "Song added successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error adding song to the database." });
    }
  });

  //Read operation of CRUD
  //Search for songs from the list by reading it from the database
  //If the song is found, that means it was read successfully from the Song collection
  //If not, then it doesn't exist in the database
  app.get("/search-song", async function (req, res) {
    const searchTerm = req.query.searchTerm;

    try {
      const foundSongs = await Song.find({
        title: { $regex: new RegExp(searchTerm, "i") },
      });

      res.json(foundSongs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error searching for songs." });
    }
  });

  //Read operation of CRUD
  //Search for playlists from the list by reading it from the database
  //If the playlist is found, that means it was read successfully from the Playlist collection
  //If not, then it doesn't exist in the database
  app.get("/search-playlist", async function (req, res) {
    const searchTerm = req.query.searchTerm;

    try {
      const foundPlaylists = await Playlist.find({
        title: { $regex: new RegExp(searchTerm, "i") },
      });

      res.json(foundPlaylists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error searching for playlists." });
    }
  });

  //Update operation of CRUD
  //We update the username with whatever the user enters
  //The page starts with "user" as the username, it then gets replaced in the UI and database with
  //any other name the user inputs
  app.post("/update-username", async function (req, res) {
    const newUsername = req.body.newUsername;

    try {
      const updatedUser = await Username.findOneAndUpdate(
        {},
        { username: newUsername },
        { new: true }
      );

      res.status(200).json(updatedUser.username);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating username." });
    }
  });

  //Delete operation of CRUD
  //We delete a song from the database based on its id
  //If there's a match, it gets deleted. Otherwise, the song wasn't in the database
  app.delete("/delete-song/:id", async function (req, res) {
    const songId = req.params.id;

    try {
      const deletedSong = await Song.findOneAndDelete({ _id: songId });

      if (deletedSong) {
        res.status(200).json({ message: "Song was successfully deleted." });
      } else {
        res.status(404).json({ message: "Song to delete not found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Error with internal server" });
    }
  });
}

//Route to the producer page
app.get("/producer", function (req, res) {
  var username = "User";
  res.render("pages/producer", {
    username: username,
  });
});

//Route to the listener page
app.get("/listener", function (req, res) {
  var username = "User";
  res.render("pages/listener", {
    username: username,
  });
});

app.get("/secret", function (req, res) {
  res.render("pages/secret");
});

//Server runs on port 8080
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
