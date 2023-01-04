import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';

import { theme } from './themes/theme';
import routes from './routes/routes';

// General components
import Header from './components/Navigation/Header/Header';
import Footer from './components/Navigation/Footer/Footer';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Restore from './pages/Restore/Restore';
import Home from './pages/Home/Home';

function App() {
  return (
    <ChakraProvider theme={ theme }>
      <Header/>
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/register" element={ <Register/> } />
        <Route path="/restore" element={ <Restore/> } />
        <Route path="/home" element={ <Home/> } />
      </Routes>
      <Footer/>
    </ChakraProvider>
  );
}

export default App;