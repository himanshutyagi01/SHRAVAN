/**
 * hooks/useVoice.ts — Custom Hook for Web Speech API
 * Provides speech recognition (STT) and speech synthesis (TTS) capabilities.
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Type declarations for Web Speech API ─────────────────────────────────────
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => void) | null;
}

interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): ISpeechRecognitionAlternative;
  [index: number]: ISpeechRecognitionAlternative;
}

interface ISpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface ISpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}

// Extend window with speech API
declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

interface UseVoiceReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  resetTranscript: () => void;
}

/**
 * useVoice — Hook to handle all voice interactions in Shravan.
 * @param onTranscriptReady — Optional callback when speech recognition returns a result
 */
const useVoice = (onTranscriptReady?: (transcript: string) => void): UseVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check if Web Speech API is supported in this browser
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // ─── Initialize Speech Recognition ──────────────────────────────────────────
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);

      if (finalTranscript && onTranscriptReady) {
        onTranscriptReady(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  // ─── Start Listening ─────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    if (isListening) return;
    try {
      setTranscript("");
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  }, [isSupported, isListening]);

  // ─── Stop Listening ──────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // ─── Reset Transcript ────────────────────────────────────────────────────────
  const resetTranscript = useCallback(() => setTranscript(""), []);

  // ─── Speak (Text-to-Speech) ──────────────────────────────────────────────────
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.includes("en") &&
        (v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google"))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // ─── Stop Speaking ───────────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    resetTranscript,
  };
};

// ─── Utility: Parse voice command ─────────────────────────────────────────────
export const parseVoiceCommand = (
  transcript: string
): { name?: string; dosage?: string; time?: string } => {
  const lower = transcript.toLowerCase();
  const result: { name?: string; dosage?: string; time?: string } = {};

  const timePatterns = [
    /at\s+(\d{1,2}):(\d{2})\s*(am|pm)?/i,
    /at\s+(\d{1,2})\s+(\d{2})\s*(am|pm)/i,
    /at\s+(\d{1,2})\s*(am|pm)/i,
  ];

  for (const pattern of timePatterns) {
    const match = lower.match(pattern);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const period = match[3] || (hours >= 12 ? "pm" : "am");

      if (period === "pm" && hours < 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;

      result.time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      break;
    }
  }

  const dosageMatch = lower.match(
    /(\d+\.?\d*)\s*(mg|milligram|gram|g|ml|tablet|capsule|drop|unit|iu|mcg)s?/i
  );
  if (dosageMatch) {
    result.dosage = `${dosageMatch[1]}${dosageMatch[2]}`;
  }

  let nameStr = lower
    .replace(/add|remind me to take|take|medicine|remind|me|reminder/gi, "")
    .replace(/at\s+\d{1,2}(:\d{2})?\s*(am|pm)?/gi, "")
    .replace(/\d+\.?\d*\s*(mg|milligram|gram|g|ml|tablet|capsule|drop|unit|iu|mcg)s?/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (nameStr.length > 1) {
    result.name = nameStr
      .split(" ")
      .filter((w) => w.length > 1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
      .trim();
  }

  return result;
};

export default useVoice;
