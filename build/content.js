chrome.storage.sync.get({ seekTime: 10 }, (data) => {
  const seekTime = data.seekTime;

  document.addEventListener("keydown", (event) => {
    const video = document.querySelector("video");
    if (!video) return;

    switch (event.key) {
      case " ":
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        event.preventDefault();
        break;
      case "ArrowRight":
        if (event.shiftKey) {
          video.currentTime += seekTime * 60;
        } else {
          video.currentTime += seekTime;
        }
        if (video.paused) {
          video.play();
        }
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (event.shiftKey) {
          video.currentTime -= seekTime * 60;
        } else {
          video.currentTime -= seekTime;
        }
        if (video.paused) {
          video.play();
        }
        event.preventDefault();
        break;
    }
  });
});
