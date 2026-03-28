import CatImage from '../assets/cat.png'

const NotFound = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4">
            <div className="flex flex-col items-center p-8 gap-6 bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    404 Page not found
                </h1>
                <div className="overflow-hidden rounded-lg">
                    <img 
                        src={CatImage} 
                        alt=":(" 
                        className="max-h-64 object-contain"
                    />
                </div>
                <a href='/login' className="w-full">
                    <div className="border-2 border-slate-800 rounded-xl py-3 px-5 text-center font-bold text-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer">
                        Back to Login
                    </div>
                </a>
            </div>
        </div>
    );
}

export default NotFound;