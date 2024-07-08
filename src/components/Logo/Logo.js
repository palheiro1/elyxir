import { Image } from '@chakra-ui/react';

/**
 * This component is used to render the logo
 * @returns {JSX.Element} Logo component
 * @dev Logo is rendered with the filter invert(1) if colorMode is light
 */
const Logo = ({ isLogoGame = true, ...props }) => {
    // const logoGame = useColorModeValue("images/logos/new/logo_negro.png", "images/logos/new/logo_blanco.png");
    const logoGame = 'images/logos/new/goldLogo.svg';
    const logoTarasca = 'images/logos/new/tarasca_blanco.png';
    // const logoTarasca = useColorModeValue("images/logos/new/tarasca_negro.png", "images/logos/new/tarasca_blanco.png");
    const logoImg = isLogoGame ? logoGame : logoTarasca;

    return <Image src={logoImg} alt="Logo" maxH="100px" key="logo" {...props} />;
};

export default Logo;
