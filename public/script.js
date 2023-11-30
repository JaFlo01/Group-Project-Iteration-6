//Variables created to manipulate the DOM through event handlers, for each loops, and other methods.
const tabs = document.querySelectorAll(".tabs");
const all_content = document.querySelectorAll(".content-list");
const playlists = document.querySelectorAll(".playlist-name");
const prevSongsContent = document.querySelector(".prev-songs");
const trashIcons = document.querySelectorAll(".fa-solid.fa-trash");
const plusIcons = document.querySelectorAll(".prev-songs .fa-solid.fa-plus");
const currentPlaylist = document.querySelector(".content-list.active");
const songContainers = document.querySelectorAll(".song-container");
const songSearchInput = document.getElementById("song-search");
const playlistSearchInput = document.getElementById("playlist-search");
const usernameDisplay = document.getElementById("username-display");
const updateUsernameIcon = document.getElementById("update-username-icon");

document.addEventListener("DOMContentLoaded", function () {
  // This allows me to navigate between Current Playlist, Previous Playlist, and Previous Playlist Songs by clicking them
  // hidePrevSongs() is used at the end to initially hide the songs stored inside the playlists, that way they're only displayed
  // whenever we click on the playlist itself.
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");

      all_content.forEach((content) => {
        content.classList.remove("active");
      });
      all_content[index].classList.add("active");

      //Displays either the song search bar or playlist search bar depending on the tab we're currently in
      if (index === 0 || index === 2) {
        songSearchInput.style.display = "block";
        playlistSearchInput.style.display = "none";
      } else {
        songSearchInput.style.display = "none";
        playlistSearchInput.style.display = "block";
      }
      hidePrevSongs();
    });
  });

  //Whenever the "enter" key is pressed in the song search bar and nothing was typed in
  //we display an error message
  songSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const searchTerm = songSearchInput.value.trim();
      if (searchTerm.length < 1) {
        alert("Input invalid. Try again.");
      }
    }
  });

  //Similar functionality as the song search bar but this time it's for the playlist search bar
  playlistSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const searchTerm = playlistSearchInput.value.trim();
      if (searchTerm.length < 1) {
        alert("Input invalid. Try again.");
      }
    }
  });

  //This functions as a filter for song searches. Whenever the user types in a few characters, this event listener fetches a request
  //for a song that matches these characters in the order that they're typed. If the song isn't found in the database, then the screen
  //hides the list of songs, indicating that the song we're looking for wasn't found. If the song was found, then this event handler
  //copies the structure and values of that song and displays it to the screen, temporarily appearing as the only song in the list.
  //If there's an error fetching the request, we display the error message.
  songSearchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();

    try {
      const response = await fetch(`/search-song?searchTerm=${searchTerm}`);
      const foundSongs = await response.json();

      const songListContainer = document.querySelector(".content-list.active");
      songListContainer.innerHTML = "";

      foundSongs.forEach((song) => {
        const clonedMusicInfo = createSongElement(song);
        songListContainer.appendChild(clonedMusicInfo);
        initializeWaveform(
          clonedMusicInfo,
          clonedMusicInfo.querySelector(".fa-play")
        );
        songListContainer.insertAdjacentElement(
          "beforeend",
          document.createElement("hr")
        );
      });
    } catch (err) {
      console.error(err);
      alert("Error searching for songs. Please try again.");
    }
  });

  //Similar to the previous event handler but this one is made specifically for searching playlists under the "previous playlists" tab
  //There's an added event handler specifically for the navigation functionality between a playlist and the "previous playlist songs" tab
  playlistSearchInput.addEventListener("input", async (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();

    try {
      const response = await fetch(`/search-playlist?searchTerm=${searchTerm}`);
      const foundPlaylists = await response.json();
      const playlistSection = document.getElementById("playlist-section");
      playlistSection.innerHTML = "";

      foundPlaylists.forEach((playlist) => {
        const playlistElement = createPlaylistElement(playlist);

        //We need this to direct the user to "previous playlist songs" whenever they click on a playlist, without this
        //we won't be able to go to this tab after searching for a playlist.
        playlistElement.addEventListener("click", (e) => {
          e.preventDefault();

          prevSongsContent.style.display = "block";

          tabs.forEach((tab) => {
            tab.classList.remove("active");
          });
          all_content.forEach((content) => {
            content.classList.remove("active");
          });

          tabs[2].classList.add("active");
          all_content[2].classList.add("active");

          songSearchInput.style.display = "none";
          playlistSearchInput.style.display = "block";
        });

        playlistSection.appendChild(playlistElement);
        playlistSection.insertAdjacentElement(
          "beforeend",
          document.createElement("hr")
        );
      });
    } catch (err) {
      console.error(err);
      alert("Error searching for playlists. Please try again.");
    }
  });

  //Used to give the trash icons their functionality for deleting songs under the "current playlist".
  //We fetch a request from the database for the song we want to delete, if it's found we remove it from the list. If it's not
  //in the database, return an error message.
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", async (event) => {
      const musicInfo = trashIcon.parentElement;
      const songId = musicInfo.dataset.songId;

      const confirmation = confirm(
        "Are you sure you want to delete this song from your current playlist?"
      );

      if (confirmation === true) {
        try {
          const songFetched = await fetch(`/delete-song/${songId}`, {
            method: "DELETE",
          });

          if (songFetched.ok) {
            musicInfo.remove();
            alert("Song was successfully deleted!");
          } else {
            alert("Error deleting song. Please try again.");
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  });

  //These event handlers are for the plus icons that appear in the list of songs under the "previous playlist songs" tab.
  //Since we're adding the song from this tab to the "current playlist" tab, we have to change a few of the contents that are displayed
  //We copy the image, title, and artist. But remove the plus icon and replace it with a waveform, play and trash icons. That way when the
  //song is added to the current playlist, it's displayed the exact same way as the rest of the songs. We also want to fetch the song request
  //before adding to the playlist to be sure that the song is in the database. We also add the necessary functionalities for the waveforms,
  //play and trash icons.
  plusIcons.forEach((plusIcon) => {
    plusIcon.addEventListener("click", async (event) => {
      const musicInfo = plusIcon.parentElement;

      const songInfo = {
        cover: musicInfo.querySelector(".song-cover img").src,
        title: musicInfo.querySelector(".song-title h6").innerText,
        artists: musicInfo.querySelector(".song-title p").innerText,
      };

      const clonedMusicInfo = musicInfo.cloneNode(true);
      const plusIconToRemove =
        clonedMusicInfo.querySelector(".fa-solid.fa-plus");
      plusIconToRemove.remove();

      const playIcon = document.createElement("i");
      playIcon.classList.add("fa-solid", "fa-play");
      clonedMusicInfo.appendChild(playIcon);

      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash");
      clonedMusicInfo.appendChild(trashIcon);

      const waveformContainer = document.createElement("div");
      waveformContainer.classList.add("waveform");
      clonedMusicInfo.appendChild(waveformContainer);

      const confirmation = confirm(
        "Are you sure you want to add this song into your current playlist?"
      );

      if (confirmation === true) {
        try {
          const response = await fetch("/add-song", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(songInfo),
          });

          if (response.ok) {
            alert("Song added successfully!");
          } else {
            alert("Error adding song. Please try again.");
          }
          currentPlaylist.appendChild(clonedMusicInfo);
          initializeWaveform(clonedMusicInfo, playIcon);

          const deleteFeature =
            clonedMusicInfo.querySelector(".fa-solid.fa-trash");
          deleteFeature.addEventListener("click", () => {
            handleDeleteSong(clonedMusicInfo);
          });

          const lineBreak = document.createElement("hr");
          currentPlaylist.appendChild(lineBreak);
          location.reload();
        } catch (err) {
          console.log(err);
        }
      }
    });
  });

  //These event handler allow each playlist under the "previous playlist" tab to be clickable. Not only that, when clicking on one, it
  //redirects the user to the "previous playlist songs" tab where it display the list of songs that was stored inside that playlist.
  playlists.forEach((playlist, index) => {
    playlist.addEventListener("click", (event) => {
      event.preventDefault();

      prevSongsContent.style.display = "block";

      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      all_content.forEach((content) => {
        content.classList.remove("active");
      });

      tabs[2].classList.add("active");
      all_content[2].classList.add("active");

      songSearchInput.style.display = "none";
      playlistSearchInput.style.display = "block";
    });
  });

  //This is used to create waveforms for each song under the "current playlist". Along with that there are styling options
  //for each waveform. The play button has a special functionality that displays the pause button whenever the song is playing, but
  //then the play button is displayed again when the song is paused or ends.
  songContainers.forEach((container, index) => {
    let waveformContainer = container.querySelector(".waveform");

    const playIcon = container.querySelector(".fa-play");

    const wavesurfer = WaveSurfer.create({
      container: waveformContainer,
      responsive: true,
      waveColor: "#d3d3d3",
      progressColor: "#E55D87",
      barWidth: 1,
      width: 300,
      responsive: true,
      height: 50,
      barRadius: 4,
    });

    const songTitle = container.querySelector(".song-title h6").innerText;
    const audioFile = `aud/${songTitle.replace(/\s/g, "_")}.mp3`;
    console.log("Audio file path: ", audioFile);
    wavesurfer.load(audioFile);

    playIcon.onclick = function () {
      wavesurfer.playPause();

      if (playIcon.classList.contains("fa-play")) {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
      } else {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
      }
    };

    wavesurfer.on("finish", function () {
      playIcon.classList.remove("fa-pause");
      playIcon.classList.add("fa-play");
      wavesurfer.stop();
    });
  });
});

//This allows the icon under the username to be clickable. Once clicked, a prompt is displayed asking for the user to enter a new
//username.
updateUsernameIcon.addEventListener("click", function () {
  const newUsername = prompt("Enter new username:");

  if (newUsername !== null && newUsername.trim() !== "") {
    updateUsername(newUsername);
  }
});

//Once entered this updated username gets stored inside the database, and displayed onto the screen until it gets updated
//again. The updated name is shown even if the user refreshes the page. If fetch request fails, display error message
async function updateUsername(newUsername) {
  try {
    const response = await fetch("/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUsername }),
    });

    if (response.ok) {
      const updatedUsername = await response.json();
      usernameDisplay.innerText = updatedUsername;
    } else {
      alert("Error updating username. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating username. Please try again.");
  }
}

// Function created to initially hide the songs stored inside the previous playlists
function hidePrevSongs() {
  prevSongsContent.style.display = "none";
}

//As mentioned before, the event handler creates a copy of the original song's structure and values and stores it inside a
//clonedMusicInfo variable. This function is where we do most of the copying besides the line break, because that's added after outside
//the song container. This also allows for the list of songs to redisplay themselves after the filtering is done. Meaning we would
//have to add everything back in order for the list of songs to display and function the way it did before searching for a song.
function createSongElement(song) {
  const songContainer = document.createElement("div");

  songContainer.classList.add("song-container");
  songContainer.dataset.songId = song._id;

  const songCover = document.createElement("div");
  songCover.classList.add("song-cover");
  const coverImg = document.createElement("img");
  coverImg.src = song.cover;
  coverImg.alt = "Song Cover";
  songCover.appendChild(coverImg);

  const songTitle = document.createElement("div");
  songTitle.classList.add("song-title");
  const titleH6 = document.createElement("h6");
  titleH6.innerText = song.title;
  const artistsP = document.createElement("p");
  artistsP.innerText = song.artists;
  songTitle.appendChild(titleH6);
  songTitle.appendChild(artistsP);

  const waveformContainer = document.createElement("div");
  waveformContainer.classList.add("waveform");

  const playIcon = document.createElement("i");
  playIcon.classList.add("fa-solid", "fa-play");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");

  songContainer.appendChild(songCover);
  songContainer.appendChild(songTitle);
  songContainer.appendChild(waveformContainer);
  songContainer.appendChild(playIcon);
  songContainer.appendChild(deleteIcon);

  deleteIcon.onclick = function () {
    handleDeleteSong(songContainer);
  };

  return songContainer;
}

// Similar functionality to the createSongElement() function but this one is designed for playlists
function createPlaylistElement(playlist) {
  const playlistContainer = document.createElement("div");
  playlistContainer.className = "song-container";

  const playlistCover = document.createElement("div");
  playlistCover.className = "song-cover";
  playlistCover.innerHTML = `<img src="${playlist.cover}" alt="" />`;
  playlistContainer.appendChild(playlistCover);

  const playlistTitle = document.createElement("div");
  playlistTitle.className = "song-title";
  playlistTitle.innerHTML = `<h6 class="playlist-name">${playlist.title}</h6>`;
  playlistContainer.appendChild(playlistTitle);

  return playlistContainer;
}

//This function behaves similarly to the trashIcon event handler but this one is designed for the createSongElement() since
//that function creates a copy of the trash icon but with no deleting functionality. This function handles that.
async function handleDeleteSong(songContainer) {
  const confirmation = confirm(
    "Are you sure you want to delete this song from your current playlist?"
  );

  if (confirmation) {
    const songId = songContainer.dataset.songId;
    try {
      const response = await fetch(`/delete-song/${songId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        songContainer.remove();
        alert("Song was successfully deleted!");
      } else {
        alert("Error deleting song. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  }
}

// This functions almost the same as the waveforms for songs under "current playlist", but this is used for songs added
// from the "previous playlist songs" tab. Without this, the songs are added successfully but without any waveforms.
function initializeWaveform(container, playIcon) {
  const waveformContainer = container.querySelector(".waveform");

  const wavesurfer = WaveSurfer.create({
    container: waveformContainer,
    responsive: true,
    waveColor: "#d3d3d3",
    progressColor: "#E55D87",
    barWidth: 1,
    width: 300,
    responsive: true,
    height: 50,
    barRadius: 4,
  });

  const songTitle = container.querySelector(".song-title h6").innerText;
  const audioFile = `aud/${songTitle.replace(/\s/g, "_")}.mp3`;
  console.log("Audio file path: ", audioFile);
  wavesurfer.load(audioFile);

  playIcon.onclick = function () {
    wavesurfer.playPause();

    if (playIcon.classList.contains("fa-play")) {
      playIcon.classList.remove("fa-play");
      playIcon.classList.add("fa-pause");
    } else {
      playIcon.classList.remove("fa-pause");
      playIcon.classList.add("fa-play");
    }
  };

  wavesurfer.on("finish", function () {
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    wavesurfer.stop();
  });
}
