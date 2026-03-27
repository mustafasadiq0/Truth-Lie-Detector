import React, { useState, useRef } from 'react';
import { ReactMic } from 'react-mic';

const AudioRecorder = ({ onAudioData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordedAudio(null);
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
  };

  // Handle recorded audio
  const onStop = (recordedData) => {
    setRecordedAudio(recordedData);
    // Pass audio data to parent component for analysis
    if (onAudioData) {
      onAudioData(recordedData);
    }
  };

  // Handle real-time audio data
  const onData = (audioData) => {
    // Pass real-time audio data to parent component for analysis
    if (onAudioData) {
      onAudioData({ blob: null, buffer: audioData, isRealTime: true });
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (recordedAudio && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle audio playback ended
  const handlePlaybackEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="audio-recorder">
      <div className="recording-controls">
        <h3>Audio Recording</h3>
        <div className="mic-visualization">
          <ReactMic
            record={isRecording}
            className="sound-wave"
            onStop={onStop}
            onData={onData}
            strokeColor="#000000"
            backgroundColor="#ffffff"
          />
        </div>
        <div className="control-buttons">
          {!isRecording ? (
            <button onClick={startRecording} className="record-button">
              Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="stop-button">
              Stop Recording
            </button>
          )}
          
          {recordedAudio && !isPlaying && (
            <button onClick={playAudio} className="play-button">
              Play Recording
            </button>
          )}
        </div>
      </div>

      {recordedAudio && (
        <div className="recorded-audio">
          <audio 
            ref={audioRef} 
            src={recordedAudio.blobURL} 
            onEnded={handlePlaybackEnded} 
            controls={false} 
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
