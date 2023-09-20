import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext)

    return (
        <div className='w-full flex items-center justify-center bg-red-600 text-white h-[60px] gap-4'>
            <Link to="/">Home</Link>
            <span> | </span>
            {user ? (
                <p onClick={logoutUser}>Logout</p>
            ) : (
                <Link to="/login" >Login</Link>
            )}
            {user && <p>Hello {user.username}!</p>}
            
        </div>
    )
}

export default Header