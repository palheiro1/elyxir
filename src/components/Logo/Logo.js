import { Image, useColorModeValue } from "@chakra-ui/react"


/**
 * This component is used to render the logo
 * @returns {JSX.Element} Logo component
 * @dev Logo is rendered with the filter invert(1) if colorMode is light
 */
const Logo = ({isLogoGame = true}) => {

    const filtro = useColorModeValue("invert(1)", "invert(0)");
    const logoImg = isLogoGame ? "images/logo_transparent.png" : "images/logo_tarasca.png"

    return (
        <Image src={logoImg} alt="Logo" filter={filtro} maxH="100px" key="logo" />
    )
}

export default Logo