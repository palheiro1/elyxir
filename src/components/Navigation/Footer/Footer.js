import Navigation from '../Navigation';

/**
 * Footer component
 * @returns {JSX.Element} Footer component
 * @dev This component is used to render the footer navigation
 * @author Jesús Sánchez Fernández
 */
const Footer = ({ isLogged }) => {
    return(<Navigation isHeader={false} isLogged={isLogged} />);
}

export default Footer;