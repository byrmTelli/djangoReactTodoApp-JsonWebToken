import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    
    let [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        return storedTokens ? JSON.parse(storedTokens) : null;
      });
      
    
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()
   
    
    

    let loginUser = async (e) => {
        e.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: e.target.username.value, password: e.target.password.value })
        });

        let data = await response.json();

        if(data){
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            navigate('/')
        } else {
            alert('Something went wrong while logging in the user!')
        }
    }


    let logoutUser = (e) => {
        e.preventDefault()
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }
    //Token updating via sending post request to the related url.
    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh:authTokens?.refresh})
        })
       
        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }


    //Necessary variables selected here to export.
    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    //To handle jwt resreshing.
    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 30 * 1 // 30 Second
        let interval = setInterval(() => {
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}