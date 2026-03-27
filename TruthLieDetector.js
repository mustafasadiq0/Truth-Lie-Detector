import React, { useState, useEffect } from 'react';

const TruthLieDetector = ({ analysisResult }) => {
  const [truthProbability, setTruthProbability] = useState(0.5);
  const [detectionResult, setDetectionResult] = useState('Waiting for input...');
  const [confidenceLevel, setConfidenceLevel] = useState('Low');
  
  // Update detector when new analysis results are received
  useEffect(() => {
    if (analysisResult && typeof analysisResult.truthProbability === 'number') {
      setTruthProbability(analysisResult.truthProbability);
      updateDetectionResult(analysisResult.truthProbability);
    }
  }, [analysisResult]);
  
  // Determine the detection result based on truth probability
  const updateDetectionResult = (probability) => {
    // Set the detection result text
    if (probability >= 0.7) {
      setDetectionResult('TRUTH');
    } else if (probability <= 0.3) {
      setDetectionResult('LIE');
    } else {
      setDetectionResult('UNCERTAIN');
    }
    
    // Set the confidence level
    const deviation = Math.abs(probability - 0.5);
    if (deviation >= 0.35) {
      setConfidenceLevel('High');
    } else if (deviation >= 0.15) {
      setConfidenceLevel('Medium');
    } else {
      setConfidenceLevel('Low');
    }
  };
  
  // Calculate color based on truth probability
  const getResultColor = () => {
    // Green for truth, red for lie, yellow for uncertain
    if (truthProbability >= 0.7) {
      return '#4CAF50'; // Green
    } else if (truthProbability <= 0.3) {
      return '#F44336'; // Red
    } else {
      return '#FFC107'; // Yellow/Amber
    }
  };
  
  // Calculate meter position based on truth probability
  const getMeterPosition = () => {
    return `${truthProbability * 100}%`;
  };
  
  return (
    <div className="truth-lie-detector">
      <h3>Detection Results</h3>
      
      {/* Text indicator */}
      <div 
        className="result-text"
        style={{ 
          color: getResultColor(),
          fontWeight: 'bold',
          fontSize: '24px',
          marginBottom: '10px'
        }}
      >
        {detectionResult}
      </div>
      
      {/* Confidence level */}
      <div className="confidence-level">
        Confidence: {confidenceLevel}
      </div>
      
      {/* Meter indicator */}
      <div className="meter-container" style={{ 
        width: '100%', 
        height: '30px', 
        backgroundColor: '#e0e0e0',
        borderRadius: '15px',
        overflow: 'hidden',
        margin: '15px 0',
        position: 'relative'
      }}>
        <div className="meter-scale" style={{
          display: 'flex',
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          padding: '0 10px',
          boxSizing: 'border-box',
          alignItems: 'center',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 2
        }}>
          <span>LIE</span>
          <span>UNCERTAIN</span>
          <span>TRUTH</span>
        </div>
        
        <div className="meter-fill" style={{
          width: getMeterPosition(),
          height: '100%',
          backgroundColor: getResultColor(),
          transition: 'width 0.5s ease, background-color 0.5s ease',
          borderRadius: '15px',
          zIndex: 1
        }} />
        
        <div className="meter-marker" style={{
          position: 'absolute',
          left: getMeterPosition(),
          top: '0',
          width: '4px',
          height: '100%',
          backgroundColor: '#000',
          transform: 'translateX(-2px)',
          transition: 'left 0.5s ease',
          zIndex: 3
        }} />
      </div>
      
      {/* Probability percentage */}
      <div className="probability">
        Truth Probability: {Math.round(truthProbability * 100)}%
      </div>
    </div>
  );
};

export default TruthLieDetector;
