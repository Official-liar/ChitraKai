import React from "react";
import Main from './components/Game/Main'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
   <div className="flex flex-col h-screen p-0">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:roomId" element={<Main />} />
        </Routes>
      </BrowserRouter>
   </div>
  );
}

export default App;
