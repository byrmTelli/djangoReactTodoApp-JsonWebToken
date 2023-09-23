import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import {FaEye,FaTrashCan} from 'react-icons/fa6'
import {BiEdit} from 'react-icons/bi'

import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const { authTokens, logoutUser} = useContext(AuthContext);
    let [profile, setProfile] = useState([])
    let [planData,setPlanData] = useState([])

    const [openIndex, setOpenIndex] = useState(null);
    const [editIndex,setEditIndex] = useState(null);

    const navigate = useNavigate()

    console.log(planData)
    
    useEffect(() => {
        getProfile()
        getData()
    },[])




    let deletePlan = async (e,id) => {
        e.preventDefault();
            try {
                const response = await fetch(`http://localhost:8000/api/data/delete/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access)
                    },
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
        }

    let addingPlan = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/data/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({ 
                    title: e.target.elements.title.value,
                    description: e.target.elements.description.value ,
                    creator: profile.user.id })
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
        e.target.reset()
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

    const editData = async (e, id) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
    
            // Kontrol etmek istediğiniz alanları belirleyin
            const newTitle = formData.get('title');
            const newDescription = formData.get('description');
    
            // Sadece title veya description alanını güncellemek istiyorsanız, koşullu bir şekilde güncelleme yapın
            const dataToUpdate = {};
            
            if (newTitle) {
                dataToUpdate.title = newTitle;
            }
    
            if (newDescription) {
                dataToUpdate.description = newDescription;
            }
    
            const response = await fetch(`http://localhost:8000/api/data/edit/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(dataToUpdate) // Sadece güncellenmesi gereken alanları içerir
            });
    
            if (response.ok) {
                getData();
                navigate('/');
            } else {
                console.error('Data addition error:', response.statusText);
            }
            e.target.reset();
        } catch (error) {
            console.error('Data addition error:', error);
        }
    };
    
    


    const handleToDoClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
    setEditIndex(null);

  };



  const handleTodoEditClick = (index) => {
      setEditIndex(index === editIndex ? null : index);
      setOpenIndex(null);
  };

    return (
        <div className='flex flex-col w-full items-center justify-center'>
        <div className='bg-[#eee] w-10/12 flex flex-col mt-2 border p-4'>
                <h1 className='text-3xl'>Add To Do</h1>
                <div className="w-full">
                <form onSubmit={addingPlan} className='flex flex-col'>
                    <div className="flex w-full">
                        <div className="p-2 w-[140px] flex flex-col">
                            <label className='p-2'>Title</label>
                            <label className='p-2'>Description</label>
                        </div>
                        <div className="p-2  w-full">
                            <input className='p-2 w-full border' type="text" name="title" placeholder={`type title here...`}/>
                            <textarea className='p-2 w-full mt-2 h-[200px] border' type="text" name="description" placeholder={`type description here ...`}/>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                    <input className='p-2 bg-[#113f67] w-[150px] text-white' type="submit" value={"Add"}/>
                    </div>
                </form>                
                </div>
            </div>

            <div className={`${planData.length<=0 ?"hidden":" "} mt-10 bg-[#eee] flex flex-col items-center justify-center w-10/12 gap-3 p-4`}>
              {
                planData.map((item,key)=>(
                    <div className='w-full'>
                        <div className='w-full flex relative items-center p-2 border bg-[#113f67] text-white'>
                            <p key={key}>{item.title} | id: {item.id}</p>
                            <div className="absolute right-3 flex gap-3 items-center">
                            <BiEdit className='hover:text-lg' onClick={()=> handleTodoEditClick(key)} />
                            <FaEye className='hover:text-lg' onClick={()=> handleToDoClick(key)}/>
                            <FaTrashCan className='hover:text-lg' onClick={(e)=> deletePlan (e,item.id)}/>
                            </div>

                        </div>

                        <div className={`${editIndex === key ? '': 'hidden'} w-full p-2`}>
                        <h1 className='text-3xl'>Edit To Do</h1>
                            <form onSubmit={(e)=>editData(e,item.id)} className='flex flex-col'>
                                <div className="flex w-full">
                                <div className="p-2 border w-[140px] flex flex-col">
                                    <label className='p-2'>Title</label>
                                    <label className='p-2'>Description</label>
                                </div>
                                <div className="p-2 border w-full">
                                    <input className='p-2 w-full' type="text" name="title" placeholder={`${item.title}`}/>
                                    <textarea className='p-2 w-full mt-2 h-[200px]' type="text" name="description" placeholder={`${item.description}`}/>
                                </div>
                                </div>
                                <div className="w-full flex items-center justify-center">
                                    <input className='p-2 bg-[#113f67] w-[150px] text-white' type="submit" value={"Submit"}/>
                                </div>
                            </form>
                        </div>


                        <div className={`w-full p-2  ${openIndex === key ? '' : 'hidden'}`}>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))
              }
            </div>
        </div>
    )
}

export default HomePage