import { useState } from "react";
import "./App.css";

function App() {
  const [seekTime, setSeekTime] = useState(10);

  const seek = (seconds: number) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) return;

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        args: [seconds],
        func: (funcSeconds) => {
          const video = document.querySelector("video");
          if (!video) return;
          video.currentTime += funcSeconds;
          if (video.paused) {
            video.play();
          }
        },
      });
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
    </div>
  );
}

export default App;
