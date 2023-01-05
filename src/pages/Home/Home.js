import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MainPanel from "../../components/HomePage/MainPanel/MainPanel"

/**
 * @name Home
 * @description Home page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the home page
 * @returns {JSX.Element} Home component
 */
const Home = ({ infoAccount }) => {

    const navigate = useNavigate()

    useEffect(() => {
        if(infoAccount.token === null && infoAccount.accountRs === null)
            navigate("/login")

    }, [infoAccount, navigate])


    return (
        <MainPanel/>
    )
}

export default Home