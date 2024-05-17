import React , { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'


const Signup = () => {
    const [email ,setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [name , setName] = useState("")
    const [error , setError] = useState(null)

    const handleSignup = async (e) =>{
        e.preventDefault();

          if(!email){
            setError("email is missing")
            return
          }
          if(!password){
            setError("password is missing")
            return
          }
          if(!name){
            setError("password is missing")
            return
          }
    
          setError("")


          try {
            const response = await axiosInstance.post("/api/createUser" , {
              email: email,
              name: name,
              password: password
            })
            if(response.data.message){
              alert(response.data.message)
            }
          } catch (error) {
            if(error.response && error.response.error){
              setError(error.response.data.error)
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
                <form onSubmit={handleSignup}>
                    <h4 className="text-2xl mb-7">Signup</h4>

                    <input type='text' placeholder='name' className='input-box' value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input type='text' placeholder='email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type='password' placeholder='password' className='input-box' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
 

                    <button type='submit' className='btn-primary'>Signup</button>

                    <p className='text-sm text-centre mt-4'>
                        Already have an account?{" "}
                        <Link to="/login" className='font-medium text-primary underline'>
                            Login
                        </Link>
                    </p>
                    
                </form>
            </div>
            </div>
    </>
  )
}

export default Signup
