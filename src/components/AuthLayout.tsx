import type React from "react";

interface Props {
    children: React.ReactNode;
    footerLinks?: React.ReactNode;
}

const AuthLayout = ({ children, footerLinks }: Props) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-sky-700 via-sky-900 to-slate-900">
            {children}
            
            
            {footerLinks && (
                <div className="flex flex-col items-center gap-1 mt-3">
                    {footerLinks}
                </div>
            )}
        </div>
    );
};

export default AuthLayout;