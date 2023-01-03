import Login from "../pages/Login/Login"
import Home from "../pages/Home/Home"
import Register from "../pages/Register/Register"
import Restore from "../pages/Restore/Restore"

const routes = [
    {
        path : '/',
        component : Login
    },
    {
        path : '/register',
        component : Register
    },
    {
        path : '/restore',
        component : Restore
    },
    {
        path : '/home',
        component : Home
    },
]

export default routes