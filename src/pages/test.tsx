import React from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceToText } from "react-speakup";

const TestPage = () => {
  const { startListening, stopListening, transcript } = useVoiceToText({
    continuous: true,
    lang: "en-US",
  });
  return (
    <div className="flex flex-col gap-6">
      {" "}
      <div className="flex gap-6">
        <Mic onClick={startListening} role="button" />
        <MicOff onClick={stopListening} role="button" />
      </div>
      <h2>{transcript}</h2>
    </div>
  );
};

export default TestPage;
