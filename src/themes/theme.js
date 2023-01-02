import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// ----------------------------------------------------------------
// -----------------  Configuración de Chakra UI  -----------------
// ----------------------------------------------------------------

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const styles = {
  global: props => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('white', 'black')(props),
    },
    "#root": {
      display: 'flex',
      flexDirection: 'column',
      minHeight: "100vh",
    },
  }),
}

const components = {
  Drawer: {
    baseStyle: props => ({
      dialog: {
        bg: mode('white', 'dark')(props),
      },
    }),
  },
};

export const theme = extendTheme({ config, components,  styles });