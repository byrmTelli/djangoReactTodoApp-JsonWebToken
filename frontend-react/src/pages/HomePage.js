import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';

import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const { authTokens, logoutUser} = useContext(AuthContext);
    let [profile, setProfile] = useState([])
    let [planData,setPlanData] = useState([])

    const navigate = useNavigate()

    
    useEffect(() => {
        getProfile()
        getData()
    },[])

    console.log(profile)

    let addingPlan = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/data/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({ title: e.target.elements.title.value, creator: profile.user.id })
            });
    
            if (response.ok) {
                getData()
                navigate('/');
            } else {
                // İstek başarısızsa, hata mesajını işleyin veya hata durumunu ele alın
                console.error('Veri ekleme hatası:', response.statusText);
            }
        } catch (error) {
            console.error('Veri ekleme hatası:', error);
        }
    };


    const getProfile = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json()
        if(response.status === 200){
            setProfile(data)
        } else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }

    const getData = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/data', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
            })
            let plans = await response.json()
            if(response.status === 200){
                setPlanData(plans.plan_serializer)
            }
    }



    return (
        <div className='flex flex-col w-full items-center justify-center'>
        <div>
            <p>You are logged in to the homepage!</p>
            <p className='capitalize'>Name: {profile.first_name} {profile.last_name}</p>
            <p>Email: {profile.email}</p>
        </div>
        <div>
            <form onSubmit={addingPlan}>
                <input type="text" name="title" placeholder="Enter Plan Title"/>
                <input type="submit"/>
            </form>
        </div>

            <div className='mt-10 bg-[#eee] flex flex-col items-center justify-center w-full gap-3'>
              {
                planData.map((item,key)=>(
                    <p key={key}>{item.title}</p>
                ))
              }
            </div>
        </div>
    )
}

export default HomePage