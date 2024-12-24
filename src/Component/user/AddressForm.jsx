'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { API_URL, createAddress, posterFunction } from '@/Api'
import Swal from 'sweetalert2'
import UserContext from '@/userContext'

const defaultFormData = {
  userId : '',
  name : '', 
  mobile : '',
  locality : '',
  city : '',
  state : '',
  zip : '',
}

const AddressForm = ({setAddressMode}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const {user} = useContext(UserContext);

  

 useEffect(()=>{
  if(user){
    setFormData({...formData, 
      userId : user._id,
      name : user.name,
      mobile : user.mobile,
    })
    
  }
 }, [])

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name] : e.target.value});
  }

  const handleSubmit = async()=>{
    try{
      const res = await posterFunction(createAddress, formData); 
      if(res){
        setAddressMode(false);
        Swal.fire({
          icon: 'success',
          title: 'success',
          text : 'Address Created'
        })
      }
     
    }catch(e){
      console.error(e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text : 'Error in creating address'
      })
    }
  }

  return (
    <>
    <div className='p-8 px-16'>
      <Typography fontSize={26} fontWeight={800}>Create Address</Typography>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-3'>
        <div className='mt-4'>
          <TextField
          type='text'
          name='name'
          label='Name'
          value={formData.name}
          onChange={(e)=>handleChange(e)}
          />
        </div>
        <div className='mt-4'>
          <TextField
          type='text'
          name='mobile'
          label='Mobile No.'
          value={formData.mobile}
          onChange={(e)=>handleChange(e)}
          />
        </div>
        <div className='mt-4'>
          <TextField
          type='text'
          name='locality'
          label='Address'
          value={formData.locality}
          onChange={(e)=>handleChange(e)}
          />
        </div>
        <div className='mt-4'>
          <TextField
          type='text'
          name='city'
          label='City'
          value={formData.city}
          onChange={(e)=>handleChange(e)}
          />
        </div>
        <div className='mt-4'>
          <TextField
          type='text'
          name='state'
          label='State'
          value={formData.state}
          onChange={(e)=>handleChange(e)}
          />
          
        </div>
        <div className='mt-4'>
          <TextField
          type='number'
          name='zip'
          label='Area Pin Code'
          value={formData.zip}
          onChange={(e)=>handleChange(e)}
          />
          
        </div>
      </div>
      <div className='flex justify-center items-center mt-4'>
        <Button onClick={handleSubmit} variant='contained' color='success'>Submit</Button>
      </div>
    </div>
    </>
  )
}

export default AddressForm