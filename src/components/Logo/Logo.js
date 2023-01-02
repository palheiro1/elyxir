import { Image, useColorModeValue } from "@chakra-ui/react"


/**
 * Componente que renderiza el logo de la aplicación
 * @returns {JSX.Element} Componente Logo
 * @dev El logo se renderiza en base al colorMode del usuario
 * @dev Si el colorMode es light, el logo se renderiza con el filtro invert(1)
 * @dev Si el colorMode es dark, el logo se renderiza con el filtro invert(0)
 * @dev El filtro invert(1) invierte los colores del logo, por lo que se ve negro en modo light
 */
const Logo = ({isLogoGame = true}) => {

    const filtro = useColorModeValue("invert(1)", "invert(0)");
    const logoImg = isLogoGame ? "images/logo_transparent.png" : "images/logo_tarasca.png"

    return (
        <Image src={logoImg} alt="Logo" filter={filtro} h="80%" key="logo" />
    )
}

export default Logo