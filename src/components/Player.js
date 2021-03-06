import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import "../Player.css";
import Slider from "@material-ui/core/Slider";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewind";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SettingsIcon from "@material-ui/icons/Settings";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import PauseIcon from "@material-ui/icons/Pause";
import screenfull from "screenfull";
import Popover from "@material-ui/core/Popover";

const videoPaths = {
  SD: "/videos/walden_sd.mp4",
  HD: "/videos/walden_hd.mp4",
};

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playedTime, setPlayedTime] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const playerRef = useRef();
  const playerContainerRef = useRef();
  const playerControlsRef = useRef();
  const [isOpenedControls, setIsOpenedControls] = useState(false);
  const [isOpenedSettings, setIsOpenedSettings] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const speedValues = ["1x", "2x", "4x", "8x"];
  const [currentSpeedIndex, setCurrentSpeedIndex] = useState(0);
  const qualityValues = ["SD", "HD"];
  const [currentQualityIndex, setCurrentQualityIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTimeOnQualityChange, setCurrentTimeOnQualityChange] =
    useState(0);

  useEffect(() => {
    // when user changes video quality, seek to the time where the video was left off
    if (currentTimeOnQualityChange > 0)
      playerRef.current.seekTo(currentTimeOnQualityChange);
  }, [currentQualityIndex]);

  useEffect(() => {
    // hide pointer and controls if inactive for 2 seconds in full screen mode
    if (isFullscreen) {
      let timer;
      window.addEventListener("mousemove", function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setIsOpenedSettings(false);
          setIsOpenedControls(false);
          document.body.style.cursor = "none";
        }, 3000);
        document.body.style.cursor = "default";
        setIsOpenedControls(true);
      });
    }
  }, [isFullscreen]);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.code === "Space") {
        // space clicked, play the video
        handlePlayPause();
      }
    };
  }, [isPlaying]);

  function formatLabelTime(value) {
    let timeInSeconds = playedSeconds;
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds - minutes * 60);

    // format minutes and seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
  }

  const handlePlayPause = () => {
    isPlaying === false ? setIsPlaying(true) : setIsPlaying(false);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleMute = () => {
    !isMuted ? setIsMuted(true) : setIsMuted(false);
  };

  const handleVolumeChange = (e, newVolumeValue) => {
    setVolume(newVolumeValue / 100);
    setIsMuted(newVolumeValue === 0 ? true : false);
  };

  const handleToggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
    if (isFullscreen) {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
  };

  const handleProgress = (currentProgress) => {
    console.log(currentProgress);
    if (!isSeeking) {
      setPlayedTime(currentProgress.played);
      setPlayedSeconds(currentProgress.playedSeconds);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleProgressChange = (e, newProgressTime) => {
    setPlayedTime(newProgressTime / 100);
  };

  const handleProgressSeekStart = (e) => {
    setIsSeeking(true);
  };

  const handleProgressSeekDone = (e, newProgressTime) => {
    setIsSeeking(false);
    playerRef.current.seekTo(newProgressTime / 100);
  };

  const showPlayerControls = () => {
    !isFullscreen && setIsOpenedControls(true);
  };

  const hidePlayerControls = () => {
    !isFullscreen && setIsOpenedControls(false);
  };

  const openSettings = (e) => {
    if (!isOpenedSettings) {
      setAnchorEl(e.target);
      setIsOpenedSettings(true);
      document.querySelector(".playerWrapper").style.paddingRight = "0px";
    } else {
      setAnchorEl(null);
      setIsOpenedSettings(false);
    }
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
    setIsOpenedSettings(false);
  };

  const handleSpeedChange = () => {
    if (currentSpeedIndex + 1 === speedValues.length) {
      setCurrentSpeedIndex(0);
    } else {
      setCurrentSpeedIndex(currentSpeedIndex + 1);
    }
  };

  const handleQualityChange = () => {
    const played = playedSeconds;

    if (currentQualityIndex + 1 === qualityValues.length) {
      setCurrentQualityIndex(0);
    } else {
      setCurrentQualityIndex(currentQualityIndex + 1);
    }

    setCurrentTimeOnQualityChange(played);
  };

  return (
    <div
      className="playerWrapper"
      ref={playerContainerRef}
      onMouseOver={showPlayerControls}
      onMouseOut={hidePlayerControls}
    >
      <ReactPlayer
        ref={playerRef}
        url={
          qualityValues[currentQualityIndex] === "SD"
            ? videoPaths.SD
            : videoPaths.HD
        }
        playing={isPlaying}
        muted={isMuted}
        width="100%"
        height="100%"
        volume={volume}
        playbackRate={parseInt(speedValues[currentSpeedIndex].substring(0, 1))}
        pip={false}
        config={{
          file: {
            attributes: {
              disablePictureInPicture: true,
            },
          },
        }}
        onProgress={handleProgress}
        onEnded={handleEnded}
      />
      <div
        className="playerControls"
        ref={playerControlsRef}
        style={
          isOpenedControls
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        <div className="videoInfo">
          <h3
            className="video_title"
            style={isFullscreen ? { fontSize: "1.25rem" } : null}
          >
            Thoreau at 200: Reflections on "Walden"
          </h3>
          <h3
            className="video_author"
            style={isFullscreen ? { fontSize: "11px" } : null}
          >
            Harvard University
          </h3>
        </div>
        <div className="actionControls">
          <div className="actionControls-content">
            <Slider
              min={0}
              max={100}
              value={playedTime * 100}
              orientation="horizontal"
              onChange={handleProgressChange}
              onChangeCommitted={handleProgressSeekDone}
              onMouseDown={handleProgressSeekStart}
              valueLabelFormat={formatLabelTime}
              valueLabelDisplay="auto"
              classes={{
                root: "sliderPlay-root",
                rail: "sliderPlay-rail",
                track: "sliderPlay-track",
                thumb: "sliderPlay-thumb",
              }}
            />
            <div className="actionIcons">
              <div className="controls">
                <div className="sound">
                  {!isMuted ? (
                    <VolumeUpIcon onClick={handleMute} />
                  ) : (
                    <VolumeOffIcon onClick={handleMute} />
                  )}
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={volume * 100}
                    orientation="horizontal"
                    classes={{
                      root: "sliderVolume-root",
                      rail: "sliderVolume-rail",
                      track: "sliderVolume-track",
                      thumb: "sliderVolume-thumb",
                    }}
                    onChange={handleVolumeChange}
                    onChangeCommitted={handleVolumeChange}
                  />
                </div>
                <div className="play">
                  <FastRewindOutlinedIcon
                    classes={{ root: "rewindIcon" }}
                    onClick={handleRewind}
                  />
                  {!isPlaying ? (
                    <PlayArrowIcon
                      classes={{ root: "playIcon" }}
                      onClick={handlePlayPause}
                    />
                  ) : (
                    <PauseIcon
                      classes={{ root: "playIcon" }}
                      onClick={handlePlayPause}
                    />
                  )}
                  <FastForwardOutlinedIcon
                    classes={{ root: "forwardIcon" }}
                    onClick={handleFastForward}
                  />
                </div>
                <div className="display">
                  <SettingsIcon
                    classes={{ root: "settingsIcon" }}
                    onClick={openSettings}
                  />
                  {isFullscreen ? (
                    <FullscreenExitIcon
                      classes={{ root: "fullScreenIcon" }}
                      onClick={handleToggleFullScreen}
                    />
                  ) : (
                    <FullscreenIcon
                      classes={{ root: "fullScreenIcon" }}
                      onClick={handleToggleFullScreen}
                    />
                  )}

                  <Popover
                    open={isOpenedSettings}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    onClose={handleCloseSettings}
                    classes={{
                      root: "settingsPopover-root",
                      paper: "settingsPopover-paper",
                    }}
                    container={playerContainerRef.current}
                    disableScrollLock={true}
                  >
                    <p className="settingsPopover__speedLabel">
                      Speed:{" "}
                      <span
                        className="settingsPopover__speed"
                        onClick={handleSpeedChange}
                      >
                        {speedValues[currentSpeedIndex]}
                      </span>
                    </p>

                    <p className="settingsPopover__qualityLabel">
                      Quality:{" "}
                      <span
                        className="settingsPopover__quality"
                        onClick={handleQualityChange}
                      >
                        {qualityValues[currentQualityIndex]}
                      </span>
                    </p>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
