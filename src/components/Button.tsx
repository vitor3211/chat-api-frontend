interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    variant?: "primary" | "secondary" | "danger";
    loading?: boolean;
    icon?: React.ElementType;
}

const Button = ({ text, variant = "primary", loading, icon: Icon, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-900/20",
        secondary: "bg-slate-800 hover:bg-slate-900 text-white border border-slate-700",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`w-full flex items-center cursor-pointer justify-center gap-3 py-3 px-5 rounded-lg font-bold transition-all active:scale-95 shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${variants[variant]} ${props.className}`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={20} />}
                    {text}
                </>
            )}
        </button>
    );
};

export default Button;