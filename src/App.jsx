import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./App.css";
import { useEffect, useRef } from "react";

const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        player.play();
        onReady && onReady(player);
      }));

    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className="video-player-test" data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

const App = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: "any",
    normalizeAutoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    loop: true,
    sources: [
      {
        src: "https://merry-christmas-psfs.s3.us-east-1.amazonaws.com/video.mp4",
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.play();

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    
  };

  return (
    <div id="bg">
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
};

export default App;
