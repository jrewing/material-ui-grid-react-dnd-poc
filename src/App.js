import React from 'react';
import './App.css';
import FullWidthGrid from './FullWidthGrid';
import {DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>The grid!</h1>
      </header>

      <div>
          <DndProvider backend={HTML5Backend}>
        <FullWidthGrid />
        </DndProvider>
      </div>
    </div>
  );
}

export default App;
