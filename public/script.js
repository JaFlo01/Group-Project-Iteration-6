const tabs = document.querySelectorAll(".tabs");
const all_content = document.querySelectorAll(".content-list");
const songSearchInput = document.getElementById("song-search");
const playlistSearchInput = document.getElementById("playlist-search");
const playlists = document.querySelectorAll(".playlist-name");
const prevSongsContent = document.querySelector(".prev-songs");
const trashIcons = document.querySelectorAll(".fa-solid.fa-trash");
const plusIcons = document.querySelectorAll(".prev-songs .fa-solid.fa-plus");
const currentPlaylist = document.querySelector(".content-list.active");

songSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = songSearchInput.value.trim();
    if (searchTerm.length < 1) {
      alert("Input invalid. Try again.");
    } else {
      alert("You searched for: " + searchTerm);
    }
  }
});

playlistSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = playlistSearchInput.value.trim();
    if (searchTerm.length < 1) {
      alert("Input invalid. Try again.");
    } else {
      alert("You searched for: " + searchTerm);
    }
  }
});

plusIcons.forEach((plusIcon) => {
  plusIcon.addEventListener("click", async (event) => {
    const musicInfo = plusIcon.parentElement;

    const clonedMusicInfo = musicInfo.cloneNode(true);
    const plusIconToRemove = clonedMusicInfo.querySelector(".fa-solid.fa-plus");
    plusIconToRemove.remove();

    const confirmation = confirm(
      "Are you sure you want to add this song into your current playlist?"
    );

    if (confirmation === true) {
      try {
        const songFetched = await fetch("/add-song", {
          method: "POST",
        });

        if (songFetched.ok) {
          currentPlaylist.appendChild(clonedMusicInfo);
          alert("Song was successfully added!");
        } else {
          alert("Error adding song to the database. Try again.");
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
});

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

    if (index === 0 || index === 2) {
      songSearchInput.style.display = "block";
      playlistSearchInput.style.display = "none";
    } else {
      songSearchInput.style.display = "none";
      playlistSearchInput.style.display = "block";
    }
  });
});

playlists.forEach((playlist, index) => {
  playlist.addEventListener("click", (e) => {
    e.preventDefault();

    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    tabs[2].classList.add("active");

    all_content.forEach((content) => {
      content.classList.remove("active");
    });
    all_content[2].classList.add("active");

    prevSongsContent.style.display = "block";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let radioHost = {
    name: "James",
    showName: "Top 100 Hip-Hop Classics",
    yearsExperience: 10,
  };

  console.log("Host's name:", radioHost.name);

  radioHost.yearsExperience = 5;

  radioHost.timeSlot = "8pm-12am";

  console.log("Radio Host object after update:", radioHost);
});
