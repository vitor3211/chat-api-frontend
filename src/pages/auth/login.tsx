import { RiLockPasswordFill } from "react-icons/ri";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

const Login = () => {
  
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-sky-700 via-sky-900 to-slate-900 ">
        <form className="flex flex-col min-w-[400px] min-h-[375px] 
        justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg">
          <div className="flex justify-center items-center py-6 -mx-8 -mt-13 rounded-t-xl bg-sky-600">
            <h2 className="text-2xl font-bold text-white">Login</h2>
          </div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-600">
              <MdEmail/>
            </span>
            <input type="email" id="email" placeholder="user@email.com..." min={6} max={80} className="rounded-md pl-8 px-3 py-2 pr-5 w-full border border-slate-300 
            hover:ring-1 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent 
            transition"/>
          </div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-600"><RiLockPasswordFill/></span>
            <input type={showPassword ? "text" : "password"} id="password" placeholder="Password..." min={6} max={80} className="rounded-md pl-8 px-3 py-2 pr-9 w-full border border-slate-300 
            hover:ring-1 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent 
            transition"/>
            <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 text-slate-600 cursor-pointer">
              {showPassword ? <IoEyeSharp/> : <FaEyeSlash/>}
            </span>
          </div>
          <button className="bg-sky-600 text-white cursor-pointer font-semibold rounded-lg mt-5 py-3 
          hover:bg-sky-700 active:scale-95 transition">Sign In</button>
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-slate-300"></div>
          <span className="px-3 text-slate-500 text-sm font-medium">or try with</span>
          <div className="flex-1 border-t border-slate-300"></div>
        </div>
        <div className="flex justify-center">
        <a href="#" className="flex flex-row justify-center items-center border gap-3 bg-slate-800 w-full rounded-lg p-1 hover:bg-slate-900 transition-all ease-in-out duration-300">
          <div>
            <img 
              src="https://www.gstatic.com/images/branding/product/2x/googleg_64dp.png" 
              alt="Google Logo"
              className="w-5 h-5" 
            />
          </div>
          <span className="text-slate-100">Google</span>
        </a>
        </div>
        </form>
        <a href="/register" className="text-white hover:text-white transition-colors duration-300 underline-offset-4 hover:underline">Don't have an account yet? Sign up</a>
        <a href="/request-password" className="text-white hover:text-white transition-colors duration-300 underline-offset-4 hover:underline">Forgot password?</a>
      </div>
  );
};

export default Login;