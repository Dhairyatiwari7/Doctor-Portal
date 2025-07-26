import React, { createContext ,useState} from 'react';
//import { doctors } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useEffect } from 'react';

export const AppContext = createContext();

const UserProvider = ({ children }) => {
  const currencySymbol='$';
  const [token, setToken] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL 
  const getAvailableDoctors=async()=>{
    try {
      const response = await axios.get(`${BACKEND_URL}/api/doctor/get-all-available-doctors`);
      if(response.data.success){
    console.log(response.data)
     setDoctors(response.data.data);
    return response.data
}
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
  useEffect(()=>{
    getAvailableDoctors()
  },[])
  const value={
    getAvailableDoctors,
    currencySymbol,
    token,
    doctors,
    setToken
  }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default UserProvider;
