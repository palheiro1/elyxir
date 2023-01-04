import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';

import { theme } from './themes/theme';

// General components
import Header from './components/Navigation/Header/Header';
import Footer from './components/Navigation/Footer/Footer';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Restore from './pages/Restore/Restore';
import Home from './pages/Home/Home';
import { cleanInfoAccount } from './data/DefaultInfo/cleanInfoAccount';

function App() {

  const [ infoAccount, setInfoAccount ] = useState(cleanInfoAccount);

  return (
    <ChakraProvider theme={ theme }> 
      <Header isLogged = {infoAccount.token !== null && infoAccount.accountRs !== null} />
      <Routes>

        <Route path="/" element={ <Login setInfoAccount = {setInfoAccount} /> } />

        <Route path="/register" element={ <Register/> } />

        <Route path="/restore" element={ <Restore/> } />

        <Route path="/home" element={ 
          <Home infoAccount = {infoAccount} />
        } />

      </Routes>
      <Footer/>
    </ChakraProvider>
  );
}

export default App;