import { FaSpinner } from "react-icons/fa";

const Loader = (color) => {
    return (
        <FaSpinner className="loader" color={color}/>
    );
}

export default Loader;