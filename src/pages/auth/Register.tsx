import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Input from "../../components/Input";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import AuthLayout from "../../components/AuthLayout";

const Register = () => {
    
    return (
        <AuthLayout
          footerLinks={<a href="/login" className="text-white hover:text-white transition-colors duration-300 underline-offset-4 hover:underline">Already have an account? Sign in</a>}
        >
                  <FormHeader title="Create your account"/>
                  <Input 
                    label="Username" 
                    icon={FaUser} 
                    type="text" 
                    placeholder="Username..." 
                    required 
                  />
                  <Input 
                    label="Email Address" 
                    icon={MdEmail} 
                    type="email" 
                    placeholder="user@email.com" 
                    required 
                  />
                  <Input 
                    label="Password" 
                    icon={RiLockPasswordFill} 
                    type="password" 
                    placeholder="••••••••" 
                    required 
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
        </AuthLayout>
    );
}

export default Register;