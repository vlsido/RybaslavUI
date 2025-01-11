import { useContext } from "react";
import { AudioContext } from "../storage/AudioContext";
import { OperationError } from "../errors/OperationError";

function useAudio() {
  const {
    audioPlayer,
    playAudio,
    changeVolume
  } = useContext(AudioContext);

  if (audioPlayer === null) {
    throw new OperationError("context/hook-error", "AudioContext can only be used under AudioContextProvider");
  }

  return {
    audioPlayer,
    playAudio,
    changeVolume
  }
}

export default useAudio;
