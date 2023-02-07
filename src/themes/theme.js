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
  global: (props) => ({
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
    baseStyle: (props) => ({
      dialog: {
        bg: mode('white', 'dark')(props),
      },
    }),
  },
  Form: {
    variants: {
      floating: (props) => ({
        container: {
          label: {
            bg: props.colorMode === 'dark' ? 'black' : 'white',
            top: -5,
            left: 0,
            zIndex: 2,
            position: "absolute",
            fontSize: "sm",
            fontWeight: "bold",
            pointerEvents: "none",
            mx: 3,
            px: 1,
            my: 2,
            transformOrigin: "left top"
          }
        }
      }),
      floatingGray: (props) => ({
        container: {
          label: {
            bg: props.colorMode === 'dark' ? '#1D1D1D' : 'transparent',
            color: props.colorMode === 'dark' ? 'white' : "black",
            top: -6,
            left: 0,
            zIndex: 2,
            position: "absolute",
            fontSize: "sm",
            fontWeight: "bold",
            pointerEvents: "none",
            px: 1,
            my: 2,
            transformOrigin: "left top"
          }
        }
      })
    },
  }
};

export const theme = extendTheme({ config, components, styles});