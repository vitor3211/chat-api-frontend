import AuthLayout from "../../components/AuthLayout";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import Input from "../../components/Input";
import { LuBird } from "react-icons/lu";

const Email = () => {
    return (
            
        <AuthLayout>
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
            />
            <div className="flex justify-left text-slate-600 hover:text-slate-800 cursor-pointer w-fit">Resend email</div>
            <Button 
                text="Verify email"
                variant="secondary" 
                type="submit" 
                loading={false} 
            />    
        </AuthLayout>
    );
}
export default Email;