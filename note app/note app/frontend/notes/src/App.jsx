import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FilePage from './pages/UploadFileS3';
import DownloadFilePage from './pages/DownloadFileS3';
import DeleteFilePage from './pages/DeletFileS3'

const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route path='/dashboard' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/uploadFileToS3' element={<FilePage />} />
        <Route path='/downloadFileFromS3' element={<DownloadFilePage />} />
        <Route path='/deleteFileFromS3' element={<DeleteFilePage />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
