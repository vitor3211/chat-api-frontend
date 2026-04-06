import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Input from "../../components/Input";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import { ToastContainer, toast } from "react-toastify";
import AuthLayout from "../../components/AuthLayout";
import React, { useState } from "react";
import api from "../../service";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [email,SetEmail] = useState("");
    const [password,SetPassword] = useState("");

    const validateCredentials =()=>{
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!(regexEmail.test(email.trim()))){
              toast.error("Invalid email!", {autoClose: 3000});
              return false;
            }
            const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/;
            if(!(regexPassword.test(password.trim()))){
              toast.error("Password must have 1 uppercase letter, 1 lowercase letter, and 1 symbol!", {autoClose: 3000});
              return false;
            }
            return true;
        }

    const signUp = async (e: React.SubmitEvent)=>{
      e.preventDefault();
      
      if(validateCredentials() == false) return;
      const authToast = toast.loading("Creating account..."); 
      try{
        
        await api.post("auth/register", {name, email, password});
      
        toast.update(authToast, {
                render: "Account created! Check your email.",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });

        setTimeout(()=>{
                navigate('/email-verification');
            }, 2000)
        
      } catch(error){
        toast.update(authToast, {
                render: "Something went wrong while creating your account...",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
      }
    };

    const googleSignUp = () => {
    const w = 600;
    const h = 600;
    const left = window.screen.width / 2 - w / 2;
    const topPos = window.screen.height / 2 - h / 2;

    const backendURL = import.meta.env.VITE_API_URL;

    const authWindow: Window | null = window.open(
        `${backendURL}/oauth2/authorization/google`,
        "GoogleLogin",
        `width=${w},height=${h},top=${topPos},left=${left},resizable=yes,scrollbars=yes`
    );

    const messageListener = (event: MessageEvent) => {
        if (event.origin !== backendURL) return;

        const { token, refreshToken, expiresIn } = event.data as {
            token?: string;
            refreshToken?: string;
            expiresIn?: string;
        };

        if (token) {
            localStorage.clear();
            localStorage.setItem("token", token);
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
            if (expiresIn) localStorage.setItem("expiresIn", expiresIn);

            window.removeEventListener("message", messageListener);
            if (authWindow) authWindow.close();
            navigate("/home");
        }
    };

      window.addEventListener("message", messageListener);
  };

    return (
        <AuthLayout
          footerLinks={<a href="/login" className="text-white hover:text-white transition-colors duration-300 underline-offset-4 hover:underline">Already have an account? Sign in</a>}
        >
        <form className="flex flex-col w-[400px] justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg" onSubmit={signUp}>
          <ToastContainer/>
          <FormHeader title="Create your account"/>
          <Input 
            label="Username" 
            icon={FaUser} 
            type="text"
            placeholder="Username..."
            max={50} 
            min={6}
            required 
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            label="Email Address" 
            icon={MdEmail} 
            type="email" 
            placeholder="user@email.com" 
            required 
            onChange={(e) => SetEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            icon={RiLockPasswordFill} 
            type="password" 
            placeholder="••••••••" 
            required 
            onChange={(e) => SetPassword(e.target.value)}
          />
          <Button 
            text="Sign Up" 
            type="submit" 
            loading={false} 
          />
          <div className="flex items-center my-6">
          <div className="flex-1 border-t border-slate-300"></div>
          <span className="px-3 text-slate-500 text-sm font-medium">or try with</span>
          <div className="flex-1 border-t border-slate-300"></div>
          </div>
            <div className="flex justify-center">
                <button onClick={googleSignUp} className="flex flex-row justify-center items-center border gap-3 bg-slate-800 w-full rounded-lg p-1 hover:bg-slate-900 transition-all ease-in-out duration-300">
                <div>
                    <img 
                    src="https://www.gstatic.com/images/branding/product/2x/googleg_64dp.png" 
                    alt="Google Logo"
                    className="w-5 h-5" 
                    />
                </div>
                <span className="text-slate-100">Google</span>
            </button>
          </div>
        </form>
        </AuthLayout>
    );
}

export default Register;