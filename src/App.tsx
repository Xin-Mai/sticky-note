import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Clock from './components/Clock';
import StickyNote from './components/StickyNote/StickyNote';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clock />
        <StickyNote />
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
