import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';

import { theme } from './themes/theme';
import routes from './routes/routes';

import Header from './components/Navigation/Header/Header';
import Footer from './components/Navigation/Footer/Footer';

function App() {
  return (
    <ChakraProvider theme={ theme }>
      <Header/>
      <Routes>
        {
          routes.map((route, index) => (
            <Route
              key = { index }
              path = { route.path }
              element = { <route.component/> }
            />
          ))
        }
      </Routes>
      <Footer/>
    </ChakraProvider>
  );
}

export default App;