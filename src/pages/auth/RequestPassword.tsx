import { MdEmail } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import AuthLayout from "../../components/AuthLayout";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../service";

const Request_password = () => {

    const [email, setEmail] = useState("");

    const request = async(e: React.SubmitEvent)=>{
        e.preventDefault();
        const authToast = toast.loading("Sending...");
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!(regexEmail.test(email))){
            toast.update(authToast,{
                render: "Invalid email!",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            return;
        }

        try{
            await api.post('/auth/updatepassword', { email });
            toast.update(authToast, {
                render: "A reset link has been sent to your email.",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
            return;
            } catch(error){
            toast.update(authToast, {
                render: "Invalid email!",
                type: "error",
                isLoading: false,
                autoClose: 3000
                });
            }
        }

    return (
        <AuthLayout>
            <form className="flex flex-col w-[400px] justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg" onSubmit={request}>
            <ToastContainer/>
            <FormHeader title="Forgot Password?"/>
                    <Input
                        label="Enter your email"
                        icon={MdEmail}
                        type="email"
                        placeholder="User@email.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button 
                        text="Send" 
                        type="submit" 
                      />
            </form>
        </AuthLayout>
    );
}

export default Request_password;