import { useState } from "react";
import { type IconType } from "react-icons";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    variant?: "primary" | "secondary" 
    iconVariant?: "primary" | "secondary"
    icon?: IconType;
}

const Input = ({ label, variant = "primary", iconVariant = "primary", icon: Icon, type, ...props }: InputProps) => {
    const variants = {
        primary: "border-slate-300 focus:ring-sky-400 ",
        secondary: "border-slate-300 focus:ring-slate-800"
    };

    const iconStyles = {
        primary: {
            focus: "group-focus-within:text-sky-500",
            hover: "hover:text-sky-500"
        },
        secondary: {
            focus: "group-focus-within:text-slate-800",
            hover: "hover:text-slate-800"
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";

    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            <div className="relative flex items-center group">
                {Icon && (
                    <span className={`absolute left-3 text-slate-600 ${iconStyles[iconVariant].focus} transition-colors`}>
                        <Icon size={20} />
                    </span>
                )}
                <input
                    {...props}
                    type={isPasswordField ? (showPassword ? "text" : "password") : type}
                    className={`rounded-lg pl-10 pr-10 py-2.5 w-full border focus:ring-2 outline-none transition-all placeholder:text-slate-500 ${variants[variant]}`}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 text-slate-600 ${iconStyles[iconVariant].hover} transition-colors cursor-pointer`}
                    >
                        {showPassword ? <IoEyeSharp size={20} /> : <FaEyeSlash size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;