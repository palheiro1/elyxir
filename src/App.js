import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';

import { Routes, Route } from 'react-router-dom';

import routes from './routes/routes';

function App() {
  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
}

export default App;