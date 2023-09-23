import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import {BiSolidUserRectangle,BiSolidLock} from 'react-icons/bi'

const LoginPage = () => {

    let {loginUser} = useContext(AuthContext)

    return (
        <div className='w-full flex flex-col items-center justify-center mt-8'>
            <h1 className='text-3xl'>To Do App</h1>
            <div className="border p-4 mt-4">
            <form onSubmit={loginUser} className='flex flex-col items-center justfiy-center gap-4'>
                <div className="flex items-center justify-center border p-2">
                    <BiSolidUserRectangle/>
                    <input className='min-w-[200px] p-2 text-sm outline-none' autoComplete='off' type="text" name="username" placeholder="Enter username"/>
                </div>
                <div className="flex items-center justify-center border p-2">
                    <BiSolidLock/>
                    <input className='min-w-[200px] p-2 text-sm outline-none' type="password" name="password" placeholder="enter password"/>
                 </div>
                 <input type="submit" className='bg-[#113f67] p-2 text-xs text-white'/>
            </form>
            </div>
        </div>
    )
}

export default LoginPage