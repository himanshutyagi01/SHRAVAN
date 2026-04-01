/**
 * components/VoiceButton.tsx — Voice Interaction Button
 * Handles speech recognition and synthesis for voice commands.
 */

import React from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import useVoice from "../hooks/useVoice";
import toast from "react-hot-toast";

interface VoiceButtonProps {
  onCommand: (command: string) => void;
  placeholder?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  onCommand,
  placeholder = "Click to speak"
}) => {
  const { isListening, startListening, stopListening, speak, isSupported } = useVoice((transcript) => {
    onCommand(transcript);
  });

  const handleVoiceCommand = () => {
    if (!isSupported) {
      toast.error("Voice features not supported in this browser");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeak = (text: string) => {
    if (isSupported) {
      speak(text);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleVoiceCommand}
        disabled={!isSupported}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-lg font-medium transition-colors ${
          isListening
            ? "bg-red-600 text-white animate-pulse"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
        <span>{isListening ? "Listening..." : placeholder}</span>
      </button>

      {isSupported && (
        <button
          onClick={() => handleSpeak("Voice command recognized")}
          className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          title="Test voice feedback"
        >
          <Volume2 className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default VoiceButton;