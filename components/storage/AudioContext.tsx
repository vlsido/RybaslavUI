import {
  AudioPlayer,
  useAudioPlayer
} from "expo-audio";
import {
  createContext,
  useEffect
} from "react";
import { OperationError } from "../errors/OperationError";
import { useMMKVNumber } from "react-native-mmkv";

interface AudioContextProps {
  audioPlayer: AudioPlayer | null;
  playAudio: (uri: string) => void;
  changeVolume: (level: number) => void;
}

export const AudioContext = createContext<AudioContextProps>({
  audioPlayer: null,
  playAudio: () => { },
  changeVolume: () => { }
})

function AudioContextProvider({ children }: { children: React.ReactNode }) {
  const audioPlayer = useAudioPlayer();

  const [cachedVolumeLevel, setCachedVolumeLevel] = useMMKVNumber("audio.volume.level");

  useEffect(() => {
    if (cachedVolumeLevel !== undefined) {
      changeVolume(cachedVolumeLevel);
    }
  }, []);

  function playAudio(uri: string) {
    audioPlayer.replace({ uri });

    if (cachedVolumeLevel !== undefined) {
      audioPlayer.volume = cachedVolumeLevel / 100;
    }

    audioPlayer.play();
  }

  function changeVolume(level: number) {
    let volumeLevel = level;
    if (volumeLevel < 0)
      throw new OperationError("audio/volume-error", "Volume can only positive integer");

    setCachedVolumeLevel(volumeLevel);

    if (volumeLevel > 1) {
      volumeLevel /= 100;
    }

    audioPlayer.volume = volumeLevel;
  }

  const value = {
    audioPlayer,
    playAudio,
    changeVolume
  }
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export default AudioContextProvider;
