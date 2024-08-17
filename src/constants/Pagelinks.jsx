import Home from '../pages/Home/Home.jsx'
import Register from '../pages/Register/Register.jsx'
import Login from '../pages/Login/Login.jsx'
import Dashboard from '../pages/Dashboard/Dashboard.jsx'

const pageLinks = [
    {name: "Home", path: "", route: "/", element: <Home />},
    {name: "Register", path: "register", route: "/register", element: <Register />},
    {name: "Login", path: "login", route: "/login", element: <Login />},
    {name: "Dashboard", path: "dashboard", route: "/dashboard", element: <Dashboard />}
]

export default pageLinks
