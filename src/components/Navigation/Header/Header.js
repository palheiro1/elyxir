import Navigation from '../Navigation';

/**
 * Footer component
 * @param {boolean} isLogged - Indicates if the user is logged in or not
 * @returns {JSX.Element} Footer component
 * @dev This component is used to render the header navigation
 * @author Jesús Sánchez Fernández
 */
const Header = ({ isLogged }) => {
    return(
        !isLogged ?
            <Navigation/>
            :
            null
    );
}

export default Header;