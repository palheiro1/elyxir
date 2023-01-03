import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// ----------------------------------------------------------------
// -----------------  Configuración de Chakra UI  -----------------
// ----------------------------------------------------------------
// Floating label styles
const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)"
};

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
    baseStyle: props => ({
      dialog: {
        bg: mode('white', 'dark')(props),
      },
    }),
  }
};



const floatingLabelStyles = {
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
              ...activeLabelStyles
            },
            label: {
              top: -5,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: mode("black", "white"),
              fontSize: "sm",
              fontWeight: "bold",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top"
            }
          }
        }
      }
    }
  }
};

export const theme = extendTheme({ config, components, styles, ...floatingLabelStyles });