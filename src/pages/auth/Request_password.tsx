import { MdEmail } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import AuthLayout from "../../components/AuthLayout";

const Request_password = () => {
    return (
        <AuthLayout>
            <FormHeader title="Forgot Password?"/>
                <Input
                    label="Enter your email"
                    icon={MdEmail}
                    type="email"
                    placeholder="User@email.com"
                    required
                />
                <Button 
                    text="Send" 
                    type="submit" 
                    loading={false} 
                  />
        </AuthLayout>
    );
}

export default Request_password;