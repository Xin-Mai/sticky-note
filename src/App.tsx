import React from 'react';
import './App.scss';
import Clock from './components/Clock';
import StickyNote from './components/StickyNote/StickyNote';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clock />
        <StickyNote />
      </header>
    </div>
  );
}

export default App;
