import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import AudioAnalyzer from './components/AudioAnalyzer';
import TruthLieDetector from './components/TruthLieDetector';
import './App.css';

function App() {
  const [audioData, setAudioData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mode, setMode] = useState('real-time'); // 'real-time' or 'recorded'

  // Handle audio data from recorder
  const handleAudioData = (data) => {
    setAudioData(data);
  };

  // Handle analysis results from analyzer
  const handleAnalysisResult = (result) => {
    setAnalysisResult(result);
  };

  // Toggle between real-time and recorded modes
  const toggleMode = () => {
    setMode(mode === 'real-time' ? 'recorded' : 'real-time');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Truth/Lie Detector</h1>
        <div className="mode-toggle">
          <button 
            onClick={toggleMode}
            className={`mode-button ${mode === 'real-time' ? 'active' : ''}`}
          >
            {mode === 'real-time' ? '✓ Real-time Mode' : 'Real-time Mode'}
          </button>
          <button 
            onClick={toggleMode}
            className={`mode-button ${mode === 'recorded' ? 'active' : ''}`}
          >
            {mode === 'recorded' ? '✓ Recorded Mode' : 'Recorded Mode'}
          </button>
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="recorder-section">
            <AudioRecorder onAudioData={handleAudioData} />
          </div>

          <div className="detector-section">
            {/* Hidden analyzer component */}
            <AudioAnalyzer 
              audioData={audioData} 
              onAnalysisResult={handleAnalysisResult} 
            />
            
            {/* Visible detector component */}
            <TruthLieDetector analysisResult={analysisResult} />
          </div>
        </div>

        <div className="instructions">
          <h3>How to Use</h3>
          <p>
            {mode === 'real-time' 
              ? 'Click "Start Recording" and speak. The detector will analyze your voice in real-time.' 
              : 'Click "Start Recording", speak, then "Stop Recording". The detector will analyze your recording.'}
          </p>
          <p><strong>Note:</strong> This is a demonstration and not a scientifically accurate truth/lie detector.</p>
        </div>
      </main>

      <footer className="App-footer">
        <p>Truth/Lie Detector - For demonstration purposes only</p>
      </footer>
    </div>
  );
}

export default App;
