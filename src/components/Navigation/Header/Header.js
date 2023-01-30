import Navigation from '../Navigation';

/**
 * Footer component
 * @param {boolean} isLogged - Indicates if the user is logged in or not
 * @param {number} IGNISBalance - IGNIS balance of the user
 * @param {number} GIFTZBalance - GIFTZ balance of the user
 * @returns {JSX.Element} Footer component
 * @dev This component is used to render the header navigation
 * @author Jesús Sánchez Fernández
 */
const Header = ({ isLogged, goToMarket }) => {
    return (
        <Navigation
            isLogged={isLogged}
            goToMarket={goToMarket}
        />
    );
};

export default Header;
