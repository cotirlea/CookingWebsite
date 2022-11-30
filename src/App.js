import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from './LogIn';
import Home from './Home';
import Reciepe from './Reciepe';
import ReciepeCard from './ReciepeCard';
import CreateReciepe from './CreateReciepe';
import Test from './Test'
import UpdateReciepe from './UpdateReciepe';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LogIn/>} />
        <Route exact path="/home/:username" element={<Home/>} />
        <Route exact path="/reciepe/:name" element={<Reciepe/>} />
        <Route exact path="/create/:username" element={<CreateReciepe/>} />
        <Route exact path="/update/:name" element={<UpdateReciepe/>} />
      </Routes>
    </Router>
  );   
}

export default App;
