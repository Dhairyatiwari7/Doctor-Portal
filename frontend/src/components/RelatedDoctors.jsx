import React, { useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react';

const RelatedDoctors = ({speciality,docId}) => {
    const {doctors}=useContext(AppContext);

    const [relDoc,setRelDoc]=useState([])
    useEffect(() => {
        if(doctors.length>0 && speciality && docId){
            const doctorsData=doctors.filter((item)=>item.speciality===speciality && item._id!==docId)
            setRelDoc(doctorsData)  
        }
    },[doctors,speciality,docId])
  return (
    <div>

    </div>
  )
}

export default RelatedDoctors