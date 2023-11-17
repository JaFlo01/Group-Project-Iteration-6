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
        maxAge: 1800000,
        sameSite: "session",
      },
    })
  );

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

  const alreadyDocumented = await Song.find({});
  if (alreadyDocumented.length === 0) {
    for (const currentSong of songs) {
      const newSong = new Song(currentSong);
      await newSong.save();
    }
  }

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

  const playlistDocumented = await Playlist.find({});
  if (playlistDocumented.length === 0) {
    for (const currentPlaylist of playlists) {
      const newPlaylist = new Playlist(currentPlaylist);
      await newPlaylist.save();
    }
  }

  app.get("/", async function (req, res) {
    var username = "DJ User";

    try {
      const songs = await Song.find({});

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
      const userPlaylist = req.session.playlist;

      res.render("pages/dj", {
        songs: songs,
        playlists: playlists,
        previousSongs: previousSongs,
        deleteSong: deleteSong,
        addSong: addSong,
        username: username,
        userPlaylist: userPlaylist,
      });
    } catch (err) {
      console.log(err);
      alert("Error retrieving data.");
    }
  });

  app.post("/add-song", async function (req, res) {
    const { cover, title, artists } = req.body;

    try {
      const alreadyAdded = await Song.findOne({ title, artists });

      if (alreadyAdded) {
        res
          .status(200)
          .json({ message: "Song was already added to the database." });
      } else {
        const newSong = new Song({ cover, title, artists });
        await newSong.save();
        res
          .status(200)
          .json({ message: "Song was successfully added to the database!" });
      }
      req.session.playlist.push({ cover, title, artists });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error with internal server" });
    }
  });

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
app.get("/producer", function (req, res) {
  var username = "Producer User";
  res.render("pages/producer", {
    username: username,
  });
});

app.get("/listener", function (req, res) {
  var username = "Jimmy";
  res.render("pages/listener", {
    username: username,
  });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
