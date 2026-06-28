import React from 'react';
import { MainApp } from './components/MainApp';
import { StandaloneCapture } from './components/StandaloneCapture';

export default function App() {
  const isCaptureMode = window.location.search.includes('mode=capture');
  
  if (isCaptureMode) {
    return <StandaloneCapture />;
  }

  return <MainApp />;
}
