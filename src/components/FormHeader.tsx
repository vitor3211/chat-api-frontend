interface Props{
    title: string,
    variant?: "primary" | "secondary"
}

const FormHeader = ({title, variant = "primary"}: Props) => {

    const variants = {
        primary: "bg-sky-600",
        secondary: "bg-slate-800"
    } 

    return (
        <div className={`flex justify-center items-center py-6 -mx-8 -mt-13 rounded-t-xl ${variants[variant]}`}>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
       </div>
    );
}
export default FormHeader;