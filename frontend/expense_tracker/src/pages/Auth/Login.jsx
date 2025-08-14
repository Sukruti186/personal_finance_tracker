import React, { useContext, useState } from 'react'

import AuthLayout from '../../components/layouts/AuthLayout';
import {useNavigate} from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { Link } from 'react-router-dom';
import {validateEmail} from '../../Utils/helper.js';
import axiosInstance from '../../Utils/axiosInstance.js';
import { API_PATHS } from '../../Utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';


const Login = () => {

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);

  const {updateUser}=useContext(UserContext);
  

  const navigate=useNavigate();

  //Handle login form Submit

  const handleLogin =async(e)=>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError('Please enter a valid email address.');
      return;
    }

    if(!password){
      setError("please enter a password.");
      return;
    }

    setError("");
    //Login API call
    try{
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      const {token,user}=response.data;

      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("something went wrong.please try again.");
      }
    }
  }

  return (
    <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Welcome back</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to login</p>

          <form onSubmit={handleLogin}>
            <Input 
              value={email}
              onChange={({target})=> setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
           />

           <Input 
              value={password}
              onChange={({target})=> setPassword(target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
           />

           {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
           <button type='submit' className='btn-primary'>
            LOGIN
           </button>

           <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account? {" "}
            <Link className="font-medium text-primary underline" to="/signup">
            SignUp
            </Link>
           </p>
          </form>

        </div>
    </AuthLayout>
  )
}

export default Login;
