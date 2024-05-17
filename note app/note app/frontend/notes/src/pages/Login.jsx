import React, { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'

const Login = () => {
    const [email ,setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [error , setError] = useState(null)

    const navigate = useNavigate()

    const handleLogin = async (e) =>{
      e.preventDefault();

      if(!email){
        setError("email is missing")
        return
      }
      if(!password){
        setError("password is missing")
        return
      }

      setError("")

      //api call 

      try {
        const response = await axiosInstance.post("/api/login" , {
          email: email,
          password: password
        })

        if(response.data && response.data.accessToken){
          localStorage.setItem("token" , response.data.accessToken)
          navigate('/dashboard')
        }
      } catch (error) {
        if(error.response && error.response.data.message){
          setError(error.response.data.message)
        }else{
          setError("error , try again")
        }
      }



    }
  return (
    <>
      <Navbar />


    
      <div className='flex items-centre justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
            <form onSubmit={handleLogin}>
                <h4 className="text-2xl mb-7">Login</h4>

                <input type='text' placeholder='email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type='password' placeholder='password' className='input-box' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                <button type='submit' className='btn-primary'>Login</button>

                <p className='text-sm text-centre mt-4'>
                    Not Registered ? {" "}
                    <Link to="/signup" className='font-medium text-primary underline'>
                        Signup
                    </Link>
                </p>
                
            </form>
        </div>
      </div>
    </>
  )
}

export default Login
