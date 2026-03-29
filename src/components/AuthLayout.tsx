import type React from "react";

interface Props {
    children: React.ReactNode;
    footerLinks?: React.ReactNode;
}

const AuthLayout = ({ children, footerLinks }: Props) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-sky-700 via-sky-900 to-slate-900">
            <form className="flex flex-col w-[400px] justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg">
                {children}
            </form>
            
            {footerLinks && (
                <div className="flex flex-col items-center gap-1 mt-3">
                    {footerLinks}
                </div>
            )}
        </div>
    );
};

export default AuthLayout;