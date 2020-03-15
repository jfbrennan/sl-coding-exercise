import React from 'react';
import './App.css';
import Product from "./Product";

function App() {
  return (
    <div className="App">
      <header>
        <m-container class="pad-t-xs pad-b-xs">
          <img src="/sl-coding-exercise/logo.png" alt="Stackline logo"/>
        </m-container>
      </header>
      <m-container class="pad-t-xl">
        <Product/>
      </m-container>
    </div>
  );
}

export default App;
