import React, { useState, useRef } from "react";
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
import PauseIcon from "@material-ui/icons/Pause";
import screenfull from "screenfull";

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
    playerControlsRef.current.style.visibility = "visible";
  };

  const hidePlayerControls = () => {
    playerControlsRef.current.style.visibility = "hidden";
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
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        playing={isPlaying}
        muted={isMuted}
        width="100%"
        height="100%"
        volume={volume}
        pip={false}
        config={{ file: { attributes: { disablepictureinpicture: "true" } } }}
        onProgress={handleProgress}
        onEnded={handleEnded}
      />
      <div className="playerControls" ref={playerControlsRef}>
        <div className="videoInfo">
          <h3 className="video_title">Big Buck Bunny</h3>
          <h3 className="video_author">Blender Foundation</h3>
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
                  <SettingsIcon classes={{ root: "settingsIcon" }} />
                  <FullscreenIcon
                    classes={{ root: "fullScreenIcon" }}
                    onClick={handleToggleFullScreen}
                  />
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
