import { useEffect, useState } from "react";
import "./App.css";

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  const s = Math.floor(seconds % 60);
  if (h) {
    return [
      h.toString(),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  } else {
    return [m.toString().padStart(2, "0"), s.toString().padStart(2, "0")].join(
      ":",
    );
  }
};

function App() {
  const [seekTime, setSeekTime] = useState<number>(10);
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();

  const updateTime = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab.id) return;

      chrome.scripting?.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            const video = document.querySelector("video");
            if (!video) return;
            const { currentTime, duration } = video;
            return { currentTime, duration };
          },
        },
        (results) => {
          const result = results[0]?.result;
          if (!result) return;
          if (result.currentTime != null) {
            setCurrentTime(result.currentTime);
          }
          if (result.duration != null) {
            setDuration(result.duration);
          }
        },
      );
    });
  };

  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  const seek = (seconds: number) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab.id) return;

      chrome.scripting?.executeScript(
        {
          target: { tabId: tab.id },
          args: [seconds],
          func: (funcSeconds) => {
            const video = document.querySelector("video");
            if (!video) return;
            const { currentTime, duration } = video;
            video.currentTime += funcSeconds;
            if (video.paused) {
              void video.play();
            }
            return { currentTime, duration };
          },
        },
        (results) => {
          const result = results[0]?.result;
          if (!result) return;
          if (result.currentTime != null) {
            setCurrentTime(result.currentTime);
          }
          if (result.duration != null) {
            setDuration(result.duration);
          }
        },
      );
    });
  };

  const backward = async () => {
    seek(-seekTime);
  };

  const forward = async () => {
    seek(seekTime);
  };

  return (
    <div className="popup">
      <label htmlFor="seekTime">Seek time</label>
      <input
        id="seekTime"
        type="number"
        min="1"
        value={seekTime}
        onChange={(event) => {
          setSeekTime(event.target.valueAsNumber);
        }}
      />

      <div className="seekButtons">
        <button onClick={backward}>{"<"}</button>
        <button onClick={forward}>{">"}</button>
      </div>

      {currentTime && (
        <div>
          Current time: <div className="time">{formatTime(currentTime)}</div>
        </div>
      )}
      {duration && (
        <div>
          Duration: <div className="time">{formatTime(duration)}</div>
        </div>
      )}
    </div>
  );
}

export default App;
