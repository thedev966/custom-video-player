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
  SD:
    "https://r1---sn-ncc-nwwl.googlevideo.com/videoplayback?expire=1620253033&ei=CcWSYP_OJ4OBpATno5nACw&ip=2a0b%3A1580%3Ad96f%3Aeb01%3Aff90%3A4267%3A1da2%3A141b&id=o-ALcwLCLpn_TzLm27BT2-zEGEFU-6bvI6sydvKxPOxgTy&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ns=7XeCrBFrz9Jt1wvFRkaUaFYF&gir=yes&clen=12659459&ratebypass=yes&dur=192.818&lmt=1613371959597493&fvip=6&fexp=24001373%2C24007246&c=WEB&txp=5430432&n=CjN5O_PY6S2S4y5Z&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOgTJh995nkDSBRU9j3aliEmj0oQxd_l46FMlbhVurWVAiEA5KxvRk0mos4wzN7j4zq0eLaZg5BxA_5FQvAQHCb-o3E%3D&cms_redirect=yes&mh=Q9&mip=77.77.222.132&mm=31&mn=sn-ncc-nwwl&ms=au&mt=1620230683&mv=m&mvi=1&pl=23&lsparams=mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhAOUUi-buTKrQ3CIpMkZYCtoqIUpSSRsf1VZyJ3xKlDtiAiBeDXYZfsxCV2Ya4lYfWP75Ak91MKbMMGnTRyN4V3r6dA%3D%3D",
  HD:
    "https://r1---sn-ncc-nwwl.googlevideo.com/videoplayback?expire=1620253033&ei=CcWSYP_OJ4OBpATno5nACw&ip=2a0b%3A1580%3Ad96f%3Aeb01%3Aff90%3A4267%3A1da2%3A141b&id=o-ALcwLCLpn_TzLm27BT2-zEGEFU-6bvI6sydvKxPOxgTy&itag=22&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ns=7XeCrBFrz9Jt1wvFRkaUaFYF&cnr=14&ratebypass=yes&dur=192.818&lmt=1613372275619259&fvip=6&fexp=24001373%2C24007246&c=WEB&txp=5432432&n=CjN5O_PY6S2S4y5Z&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgJYvUFaSM79HpmETKdNegGJtzvJXbUVY6VCXekj6whV4CIQCFMEyU33xpBfGywXS7vpDd0yWLf4vAwhLJEn4rXsmA0g%3D%3D&cms_redirect=yes&mh=Q9&mip=77.77.222.132&mm=31&mn=sn-ncc-nwwl&ms=au&mt=1620230683&mv=m&mvi=1&pl=23&lsparams=mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgElLEXqRhxFddx3M9phKf-34cLvjG3gSt2X5vxpHuczMCIQCe6coxOLDgcXJ91NWL5tpDehnOx5y2e1AzylYmzx47pw%3D%3D",
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
  const [isOpenedSettings, setIsOpenedSettings] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const speedValues = ["1x", "2x", "4x", "8x"];
  const [currentSpeedIndex, setCurrentSpeedIndex] = useState(0);
  const qualityValues = ["SD", "HD"];
  const [currentQualityIndex, setCurrentQualityIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTimeOnQualityChange, setCurrentTimeOnQualityChange] = useState(
    0
  );

  useEffect(() => {
    // when user changes video quality, seek to the time where the video was left off
    if (currentTimeOnQualityChange > 0)
      playerRef.current.seekTo(currentTimeOnQualityChange);
  }, [currentQualityIndex]);

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
    playerControlsRef.current.style.visibility = "visible";
  };

  const hidePlayerControls = () => {
    playerControlsRef.current.style.visibility = "hidden";
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
      <div className="playerControls" ref={playerControlsRef}>
        <div className="videoInfo">
          <h3 className="video_title">
            4K African Wildlife | African Nature Showreel 2017
          </h3>
          <h3 className="video_author">Robert Hofmeyr</h3>
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
