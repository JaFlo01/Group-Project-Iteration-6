// Listener for glow effect
let selectedElement = null;

// Playlist variables
let selectedSongs = [];
let selectedDJ = "";
let startTimeInput;
let endTimeInput;

function toggleActive(element) {
  if (selectedElement) {
    selectedElement.classList.remove("active");
  }
  element.classList.add("active");
  selectedElement = element;
  selectedDJ = element.textContent.trim();
  console.log(selectedDJ);
}

// Validate time format (hh:mm)
function isValidTimeFormat(time) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

// Compare start and end times
function validateTimes() {
  startTimeInput = document.getElementById("start_time");
  endTimeInput = document.getElementById("end_time");
  const errorMessage = document.getElementById("error-message");
  const errorPopup = document.getElementById("error-popup");

  if (
    !isValidTimeFormat(startTimeInput.value) ||
    !isValidTimeFormat(endTimeInput.value)
  ) {
    errorMessage.textContent = "Please enter valid time formats (hh:mm).";
    showErrorPopup(errorPopup);
  } else {
    const startTime = new Date(`2000-01-01T${startTimeInput.value}`);
    const endTime = new Date(`2000-01-01T${endTimeInput.value}`);

    if (endTime < startTime) {
      errorMessage.textContent = "End time cannot be before the start time.";
      showErrorPopup(errorPopup);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("timeslot_button")
    .addEventListener("click", validateTimes);
});

// Submit button event listener
document.addEventListener("DOMContentLoaded", () => {
  // Submit button event listener
  document
    .getElementById("submit-button")
    .addEventListener("click", async () => {
      // I have tried for hours to get this to work and it just
      const playlistData = {
        // refuses to do it. Leaving it as is.
        name: "TODO",
        songs: selectedSongs,
        dj_name: selectedDJ,
        start_time: startTimeInput.value,
        end_time: endTimeInput.value,
      };
      try {
        const response = await fetch("/database/playlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playlistData),
        });
      } catch (error) {
        console.error("Error submitting playlist:", error);
      }
    });
});

// Show the error pop-up
function showErrorPopup(errorPopup) {
  errorPopup.style.display = "block";

  // Hide the error pop-up after 10 seconds
  setTimeout(function () {
    errorPopup.style.display = "none";
  }, 10000);
}
