import React, { useState } from 'react'
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { UserModel, cred } from '../models/AllModel';
import { serverString } from '../models/ServerString';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/UserSlice';

const LoginScreen:React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [loading,setLoading] = useState<boolean>(false);
    const [loginError,setLoginError] = useState<string>("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

  const [credentials,setCredentials] = useState<cred>({
    email:'',
    password:''
  })




  const getData = async () => {
    const url = `${serverString}/api/user/getUserData`;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        dispatch(addUser(response.data as UserModel));
        navigate('/home', { replace: true });
      } else {
      }
    } catch (error) {
    }
  };

  const handleSignIn = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    setLoginError(""); 

    const url = `${serverString}/api/user/login`;

    try {
      const response = await axios.post(url, credentials);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        await getData();
      } else if (response.status === 215) {
        setLoginError(response.data.error);
      } else {
        setLoginError("Error logging in");
      }
    } catch (error) {
      setLoginError("Error logging in");
    } finally {
      setLoading(false);
    }
  }






return (
<section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Link to="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          AutoDS   
      </Link>
      <p className="text-sm">Automation data delivery system</p>

      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required onChange={(e)=>{setCredentials({...credentials,email:e.target.value})}} />
                  </div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <div className='relative'>
                        <input type={visible ? "text" : "password"} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e)=>{setCredentials({...credentials,password:e.target.value})}} required/>
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                            onClick={()=>{setVisible(!visible)}}
                            >
                            {visible ? (
                                <IoIosEye size={24} />
                            ) : (
                                <IoIosEyeOff size={24} />
                            )}
                        </button>
                  </div>
                    {
                        !loading && loginError!==''?(<p className="text-center text-red-500"> {loginError}</p>):(
                        <p></p>
                        )
                    }
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" >    

                        {
                        loading?                        
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>:
                            "Sign in"
                        }
                    </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/SignUp" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default LoginScreen
