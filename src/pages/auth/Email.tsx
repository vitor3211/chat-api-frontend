import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import Input from "../../components/Input";
import { LuBird } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import api from "../../service";
import { useNavigate } from "react-router-dom";

const Email = () => {

    const navigate = useNavigate();
    const [token, setToken] = useState("");

    const validateToken = async (e: React.SubmitEvent)=>{
        e.preventDefault();

        const authToast = toast.loading("Validating token...");
        try{
            const response = await api.post("/auth/verify", { token });

            toast.update(authToast,{
                render: "Your email has been verified. Redirecting...",
                type: "success",
                isLoading: false,
                autoClose: 2000
            })

            const { token: accessToken, refreshToken, expiresIn, user } = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("expiresIn", expiresIn.toString());

            setTimeout(() => {
                navigate('/chat');
            }, 2000);

        } catch(error){
            toast.update(authToast,{
                render: "Invalid token!",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    }   

    return (
        <AuthLayout>
        <form className="flex flex-col w-[400px] justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg" onSubmit={validateToken}>
            <ToastContainer/>    
            <FormHeader title="Email verification" variant="secondary"/>
                <Input
                    label="Enter the code that we send to your email"
                    type="text"
                    variant="secondary"
                    iconVariant="secondary"
                    icon={LuBird}
                    className="flex justify-center"
                    placeholder="xxxxxxxx"
                    required
                    onChange={(e) => setToken(e.target.value)}
                    min={8}
                />
                <div className="flex justify-left text-slate-600 hover:text-slate-800 cursor-pointer w-fit">Resend email</div>
                <Button 
                    text="Verify email"
                    variant="secondary" 
                    type="submit" 
                    loading={false} 
                />
        </form>            
        </AuthLayout>
    );
}
export default Email;