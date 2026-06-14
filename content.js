let userInteracted = false;
let sideBarFound = false;

function onUserInteraction() {
  userInteracted = true;
  // Remove the event listeners after the first interaction
  document.removeEventListener("click", onUserInteraction);
  document.removeEventListener("keydown", onUserInteraction);
  document.removeEventListener("touchstart", onUserInteraction);
}

// Add event listeners for user interaction
document.addEventListener("click", onUserInteraction);
document.addEventListener("keydown", onUserInteraction);
document.addEventListener("touchstart", onUserInteraction);

class Shortcuts {
  constructor(video) {
    this.video = video;
  }
  Space(e) {
    const video = this.video;
    const targetIsInput =
      e.target.type === "textarea" ||
      e.target.type === "input" ||
      e.target.isContentEditable;
    if (targetIsInput) return;

    e.preventDefault();

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  ArrowLeft() {
    document.querySelector(".bmpui-ui-rewindbutton").click();
  }
  ArrowRight() {
    document.querySelector(".bmpui-ui-forwardbutton").click();
  }
  ArrowUp(e) {
    const video = this.video;
    e.preventDefault();
    if (video.volume < 1) {
      const newVolume = (video.volume + 0.1).toFixed(1);

      video.volume = newVolume;
      localStorage.setItem("volume", newVolume);
      video.muted = false;
    }
  }
  ArrowDown(e) {
    const video = this.video;
    e.preventDefault();
    if (video.volume > 0) {
      const newVolume = (video.volume - 0.1).toFixed(1);

      video.volume = newVolume;
      localStorage.setItem("volume", newVolume);
      video.muted = false;
    } else {
      video.muted = true;
    }
  }
  BracketLeft() {
    const video = this.video;
    const newPlaybackRate = (video.playbackRate - 0.1).toFixed(1);
    if (newPlaybackRate >= 0) {
      video.playbackRate = newPlaybackRate;
      speedContainer.innerText = newPlaybackRate + "x";
      localStorage.setItem("playbackSpeed", video.playbackRate);
      if (speedContainer.classList.contains("hidden")) {
        speedContainer.classList.remove("hidden");
        setTimeout(() => {
          speedContainer.classList.add("hidden");
        }, 1000);
      }
    }
  }
  BracketRight() {
    const video = this.video;
    const newPlaybackRate = (video.playbackRate + 0.1).toFixed(1);
    if (newPlaybackRate <= 16) {
      video.playbackRate = newPlaybackRate;
      speedContainer.innerText = newPlaybackRate + "x";
      localStorage.setItem("playbackSpeed", video.playbackRate);
      if (speedContainer.classList.contains("hidden")) {
        speedContainer.classList.remove("hidden");
        setTimeout(() => {
          speedContainer.classList.add("hidden");
        }, 1000);
      }
    }
  }
  KeyD(e) {
    toggleTheme(e)
  }
  KeyL(e) {
    toggleTheme(e)
  }
  KeyI(e) {
    document.querySelector(".bmpui-ui-piptogglebutton").click();
  }
  KeyF() {
    document.querySelector(".bmpui-ui-fullscreentogglebutton").click();
  }
  KeyM() {
    const video = this.video;
    video.muted = !video.muted;
  }
}

const themeToggleBtn = document.createElement("div");
themeToggleBtn.classList.add("btn-container");

function previousValues(video) {
  const playbackRate = localStorage.getItem("playbackSpeed");
  const volume = localStorage.getItem("volume");
  if (playbackRate) {
    video.playbackRate = playbackRate;
    speedContainer.innerText = playbackRate + "x";
  }
  if (volume) video.volume = volume;
}

document.addEventListener("keydown", (e) => {
  const video = document.querySelector("video");
  const targetIsInput =
    e.target.type === "textarea" ||
    e.target.type === "input" ||
    e.target.isContentEditable;
  if (targetIsInput) return;
  if (e.code === "Space") {
    e.preventDefault();
  }
  if (!video) return;
  const shortcuts = new Shortcuts(video);
  shortcuts[e.code]?.(e, video);
});

let shortcutsAdded = false;

let video = null;
let speedContainer = null;
const targetNode = document.getElementById("root");
const observer = new MutationObserver(() => {
  const newVideo = document.querySelector("video");
  if (video !== null && newVideo === video) return;
  video = newVideo;

  const sideBar = document.querySelector(".menu_sidebar:has(li.ant-menu-item)");
  const playbutton = document.querySelector("#play");
  const playerContainer = document.querySelector(".bitmovinplayer-container");
  console.log({ playerContainer });
  if (playerContainer) {
    const newSpeedContainer = document.createElement("span");
    speedContainer = newSpeedContainer;
    speedContainer.className = "playback-speed hidden";
    playerContainer.append(speedContainer);
  }
  // if (
  //   playbutton &&
  //   userInteracted &&
  //   location.href !== "https://app.procodrr.com/web/activity"
  // ) {
  //   playbutton?.click();
  // }
  if (sideBar && !sideBarFound) {
    sideBar.addEventListener("click", (e) => {
      if (e.target.closest("li.ant-menu-item")) {
        const intervalId = setInterval(() => {
          const playbutton = document.querySelector("#play");

          if (playbutton) {
            playbutton?.click();
          }
          const video = document.querySelector("video");
          const player =
            document.querySelector(".show-v-a-a-images")?.lastChild;
          if (
            (video && !video.paused) ||
            (player && player.className.includes("scaffold"))
          ) {
            clearInterval(intervalId);
          }
        }, 100);
      }
    });
    sideBarFound = true;
  }
  if (video) {
    video.addEventListener("play", function () {
      previousValues(video);
    });
    video.addEventListener("volumechange", (e) => {
      localStorage.setItem("volume", video.volume);
    });
    video.addEventListener("ratechange", () => {
      localStorage.setItem("playbackSpeed", video.playbackRate);
    });
  }
});

observer.observe(targetNode, {
  childList: true,
  subtree: true,
});

function toggleFullScreen() {
  const videoElement = document.querySelector("video");

  if (document.fullscreenElement) {
    // Exit fullscreen mode
    document.exitFullscreen();
  } else {
    // Enter fullscreen mode
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      // Firefox
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      // IE/Edge
      videoElement.msRequestFullscreen();
    }
  }
}

function toggleTheme(event) {
  const darkThemeLinkId = 'dark-theme-stylesheet';
  const existingLink = document.getElementById(darkThemeLinkId);

  if (existingLink) {
    // If the dark theme is already applied, remove the stylesheet
    existingLink.parentNode.removeChild(existingLink);
  } else {
    // If the dark theme is not applied, create and append the stylesheet link
    const link = document.createElement('link');
    link.id = darkThemeLinkId;
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('dark.css');
    document.head.appendChild(link);
  }
}

// calling function for default dark mode
toggleTheme()