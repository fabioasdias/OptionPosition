import React, { Component } from 'react';
import './App.css';
import Map from './glmap.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map 
          URL={"./demo.geojson"}
        />
      </div>
    );
  }
}

export default App;
