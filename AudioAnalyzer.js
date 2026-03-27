import React, { useEffect, useRef, useState } from 'react';
import Meyda from 'meyda';

const AudioAnalyzer = ({ audioData, onAnalysisResult }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [features, setFeatures] = useState(null);
  const audioContext = useRef(null);
  const analyzer = useRef(null);
  const source = useRef(null);

  // Initialize audio context and analyzer when component mounts
  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Process audio data when it's received
  useEffect(() => {
    if (audioData && audioData.blob) {
      processRecordedAudio(audioData.blob);
    } else if (audioData && audioData.buffer && audioData.isRealTime) {
      // For real-time analysis, we would process the buffer directly
      // This is simplified for demonstration purposes
      processRealTimeAudio(audioData.buffer);
    }
  }, [audioData]);

  // Process recorded audio blob
  const processRecordedAudio = async (blob) => {
    setAnalyzing(true);
    
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
      
      // Extract audio features
      const extractedFeatures = extractAudioFeatures(audioBuffer);
      setFeatures(extractedFeatures);
      
      // Calculate truth/lie probability
      const result = analyzeForTruthLie(extractedFeatures);
      
      // Send result to parent component
      if (onAnalysisResult) {
        onAnalysisResult(result);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  // Process real-time audio buffer
  const processRealTimeAudio = (buffer) => {
    // In a real implementation, we would connect to the audio stream
    // and use Meyda's real-time analyzer
    // This is simplified for demonstration purposes
    
    if (!analyzer.current && audioContext.current) {
      source.current = audioContext.current.createBufferSource();
      analyzer.current = Meyda.createMeydaAnalyzer({
        audioContext: audioContext.current,
        source: source.current,
        bufferSize: 512,
        featureExtractors: ['rms', 'zcr', 'spectralFlatness', 'spectralCentroid', 'loudness'],
        callback: (features) => {
          setFeatures(features);
          const result = analyzeForTruthLie(features);
          if (onAnalysisResult) {
            onAnalysisResult(result);
          }
        }
      });
      analyzer.current.start();
    }
  };

  // Extract audio features from buffer
  const extractAudioFeatures = (audioBuffer) => {
    // In a real implementation, we would use more sophisticated feature extraction
    // This is simplified for demonstration purposes
    
    // Convert audio buffer to features
    const bufferLength = audioBuffer.length;
    const channelData = audioBuffer.getChannelData(0);
    
    // Calculate basic features
    let sum = 0;
    let zeroCrossings = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      sum += Math.abs(channelData[i]);
      if (i > 0 && ((channelData[i] >= 0 && channelData[i-1] < 0) || 
                    (channelData[i] < 0 && channelData[i-1] >= 0))) {
        zeroCrossings++;
      }
    }
    
    const rms = Math.sqrt(sum / bufferLength);
    const zcr = zeroCrossings / bufferLength;
    
    return {
      rms,
      zcr,
      spectralFlatness: Math.random() * 0.5, // Simulated for demo
      spectralCentroid: 2000 + Math.random() * 1000, // Simulated for demo
      loudness: { total: rms * 100 }
    };
  };

  // Analyze features to determine truth/lie probability
  const analyzeForTruthLie = (features) => {
    // In a real implementation, this would use a trained model
    // This is a simplified demonstration that uses basic audio features
    // to simulate truth/lie detection
    
    if (!features) return { truthProbability: 0.5 };
    
    // Calculate a "nervousness score" based on audio features
    // Higher values might indicate more stress/nervousness
    const loudness = features.loudness?.total || features.rms * 100;
    const variability = features.zcr || 0;
    const pitch = features.spectralCentroid || 2500;
    const steadiness = features.spectralFlatness || 0.3;
    
    // Calculate a score (this is purely for demonstration)
    // In reality, truth/lie detection would require a sophisticated model
    let nervousnessScore = 
      (loudness / 50) * 0.3 + 
      (variability * 10) * 0.2 + 
      ((pitch - 2000) / 1000) * 0.2 + 
      ((1 - steadiness) * 2) * 0.3;
    
    // Normalize between 0 and 1
    nervousnessScore = Math.max(0, Math.min(1, nervousnessScore));
    
    // Invert to get "truth probability" (higher nervousness = lower truth probability)
    // Add some randomness to make it more interesting
    const randomFactor = Math.random() * 0.3 - 0.15; // -0.15 to 0.15
    const truthProbability = Math.max(0, Math.min(1, 1 - nervousnessScore + randomFactor));
    
    return {
      truthProbability,
      features
    };
  };

  return (
    <div className="audio-analyzer">
      {analyzing && <div className="analyzing-indicator">Analyzing audio...</div>}
    </div>
  );
};

export default AudioAnalyzer;
