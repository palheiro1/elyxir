import { Image, useColorModeValue } from "@chakra-ui/react"


/**
 * This component is used to render the logo
 * @returns {JSX.Element} Logo component
 * @dev Logo is rendered with the filter invert(1) if colorMode is light
 */
const Logo = ({isLogoGame = true}) => {

    const logoGame = useColorModeValue("images/logos/logo_black.png", "images/logos/logo_white.png");
    const logoTarasca = useColorModeValue("images/logos/logo_tarasca_black.png", "images/logos/logo_tarasca_white.png");
    const logoImg = isLogoGame ? logoGame : logoTarasca

    return (
        <Image src={logoImg} alt="Logo" maxH="100px" key="logo" />
    )
}

export default Logo