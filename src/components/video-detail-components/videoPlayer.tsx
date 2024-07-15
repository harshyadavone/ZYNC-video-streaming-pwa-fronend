import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import "@vidstack/react/player/styles/base.css";
import Hls from "hls.js";

import {
  Airplay,
  Download,
  Maximize,
  Minimize,
  PictureInPicture,
  FastForward,
  Play,
  Rewind,
} from "lucide-react";

import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  isHLSProvider,
} from "@vidstack/react";
import {
  PlyrLayout,
  PlyrLayoutIcon,
} from "@vidstack/react/player/layouts/plyr";
import "../../index.css";
import {
  PauseIcon,
  PlayIcon,
  restart,
  settings,
  VolumeHighIcon,
  VolumeOffIcon,
} from "../ui/Icons";
import { forwardRef, useEffect, useRef, useState } from "react";

type NewType = {
  src: string;
  title: string;
  duration: number;
  autoPlay: boolean;
  onTimeUpdate?: (currentTime: number) => void;
};

type Props = NewType;

const VideoPlayer = forwardRef<MediaPlayerInstance, Props>(
  (
    { src, duration, title, autoPlay = true, onTimeUpdate },
    ref
  ): JSX.Element => {
    const playerRef = useRef<HTMLDivElement | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    function onProviderChange(provider: any) {
      if (isHLSProvider(provider)) {
        provider.library = Hls;
      }
    }
    // Wrapper to ensure icons match PlyrLayoutIcon type
    const IconWrapper =
      (Icon: React.ComponentType<any>): PlyrLayoutIcon =>
      (props) =>
        <Icon {...props} />;

    const customIcons = {
      AirPlay: IconWrapper(Airplay),
      CaptionsOff: IconWrapper(Play),
      CaptionsOn: IconWrapper(Play),
      Download: IconWrapper(Download),
      EnterFullscreen: IconWrapper(Minimize),
      EnterPiP: IconWrapper(PictureInPicture),
      ExitFullscreen: IconWrapper(Maximize),
      ExitPiP: IconWrapper(PictureInPicture),
      FastForward: IconWrapper(FastForward),
      Muted: IconWrapper(VolumeOffIcon),
      Pause: IconWrapper(PauseIcon),
      Play: IconWrapper(PlayIcon),
      Restart: IconWrapper(restart),
      Rewind: IconWrapper(Rewind),
      Settings: IconWrapper(settings),
      Volume: IconWrapper(VolumeHighIcon),
    };

    useEffect(() => {
      const player = playerRef.current;
      if (player) {
        const settingsButton = player.querySelector('.plyr__control--settings') as HTMLElement;
        const settingsMenu = player.querySelector('.plyr__menu__container') as HTMLElement;

        if (settingsButton && settingsMenu) {
          const handleSettingsToggle = () => {
            setIsSettingsOpen(prev => !prev);
          };

          settingsButton.addEventListener('click', handleSettingsToggle);

          // Cleanup function
          return () => {
            settingsButton.removeEventListener('click', handleSettingsToggle);
          };
        }
      }
    }, []);

    useEffect(() => {
      if (isSettingsOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isSettingsOpen]);


    return (
      <div className="custom-video-player" ref={playerRef}>
        <MediaPlayer
          ref={ref}
          title={title}
          src={src}
          autoPlay={autoPlay}
          playsInline
          load="eager"
          posterLoad="eager"
          crossOrigin
          storage={`video-player-settings-${title}`}
          onProviderChange={onProviderChange}
          duration={duration}
          streamType="on-demand"
          onTimeUpdate={(e) => onTimeUpdate?.(e.currentTime)}
        >
          <MediaProvider></MediaProvider>
          <PlyrLayout icons={customIcons} />
        </MediaPlayer>
      </div>
    );
  }
);

export default VideoPlayer;
