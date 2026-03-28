import { MdEmail } from "react-icons/md";

const Request_password = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-700 via-sky-900 to-slate-900">
            <form className="flex flex-col justify-center px-8 py-7 bg-white rounded-xl gap-3 shadow-lg">
                <div className="flex justify-center items-center py-6 -mx-8 -mt-13 rounded-t-xl bg-sky-600">
                    <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
                </div>
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Enter your email</label>
                <div className="flex relative items-center">
                    <span className="absolute left-3 text-slate-600"><MdEmail/></span>
                    <input type="email" id="email" placeholder="user@email.com" className="rounded-md pl-8 px-3 py-2 pr-5 w-full border border-slate-300 
                    hover:ring-1 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent 
                    transition"/>
                </div>
                <button className="bg-sky-600 text-white cursor-pointer font-semibold rounded-lg mt-5 py-3 
                  hover:bg-sky-700 active:scale-95 transition">Send</button>
            </form> 
            
        </div>
    );
}

export default Request_password;