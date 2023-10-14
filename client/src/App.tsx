import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Plans from './pages/Plans';
import Home from './pages/Home';

function App() {
  return (

    <BrowserRouter>
      <Routes>
         <Route path="/">
          <Route index element={<Home />} />
          <Route path="plans" element={<Plans />} />
        </Route>
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
