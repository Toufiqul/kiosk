import React, { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceToText } from "react-speakup";

const VoiceAssistant = () => {
  const { startListening, stopListening, transcript } = useVoiceToText({
    continuous: false,
    lang: "en-US",
  });
  const [truncatedTranscript, setTruncatedTranscript] = useState("");

  const [isOpen, setIsOpen] = useState(false); // To toggle the assistant's open/close state
  const handleCommand = (command: string) => {
    console.log("Command received:", command);
    // Call your function here with the command
  };
  useEffect(() => {
    // Check if "command" exists in the transcript
    const commandIndex = transcript.toLowerCase().indexOf("command");
    if (commandIndex !== -1) {
      // Extract the text after "command"
      const command = transcript.slice(commandIndex + "command".length).trim();
      handleCommand(command); // Send the command to your function
    }

    // Update the truncated transcript
    setTruncatedTranscript(transcript.slice(0, 50));
  }, [transcript]);
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        {isOpen ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-xl w-72">
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Voice Assistant
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {transcript || "Start speaking to see the transcript."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startListening}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Start
            </button>
            <button
              onClick={stopListening}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
