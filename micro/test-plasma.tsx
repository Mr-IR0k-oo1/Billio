import React from 'react';
import Plasma from './src/pages/Plasma';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Plasma 
          color="#4d5652"
          speed={0.4}
          direction="forward"
          scale={1.5}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center', paddingTop: '50px' }}>
        <h1>Plasma Test</h1>
        <p>If you can see the plasma effect in the background, it's working!</p>
      </div>
    </div>
  );
}

export default App;