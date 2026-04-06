import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import Input from "../../components/Input";
import { RiLockPasswordFill } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../../service";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {

    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const validatePasswords = () => {
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/;
        if(!(regexPassword.test(newPassword.trim())) || !(regexPassword.test(newPassword2.trim()))){
          toast.error("Password must have 1 uppercase letter, 1 lowercase letter, and 1 symbol!", {autoClose: 3000});
          return false;
        }
        if(newPassword != newPassword2){
            toast.error("Passwords are not the same!");
            return false;
        }
        return true;
    }

    const changePassword = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if(validatePasswords() == false) return;

        const authToast = toast.loading("");
        try{

            await api.put(`/auth/updatepassword/${token}`, {newPassword});

            toast.update(authToast, {
                    render: "Password changed successfully! Logging you in...",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                setTimeout(() => {
                    navigate("/login");
                }, 3000);
        } 
        catch(error){
            toast.update(authToast, {
                render: "Something went wrong...",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    }

    return (
        <AuthLayout>
            <form className="flex flex-col w-[400px] justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg" onSubmit={changePassword}>
                <ToastContainer/>
                <FormHeader title="Change Password" variant="secondary"/>
                    <Input
                        label="Enter your new password"
                        icon={RiLockPasswordFill}
                        type="password"
                        variant="secondary"
                        iconVariant="secondary"
                        placeholder="••••••••"
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        max={50}
                        min={6}
                    />
                    <Input
                        label="Enter your new password again"
                        icon={RiLockPasswordFill}
                        type="password"
                        variant="secondary"
                        iconVariant="secondary"
                        placeholder="••••••••"
                        required
                        onChange={(e) => setNewPassword2(e.target.value)}
                        max={50}
                        min={6}
                    />
                    <Button
                        text="Confirm"
                        type="submit"
                        variant="secondary"
                        loading={false}
                    />
            </form>        
        </AuthLayout>
    );
}
export default ChangePassword;