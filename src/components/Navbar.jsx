import { useNavigate } from "react-router";

function Navbar() {
  const nav=useNavigate()
  return (
    <div className="text-2xl sm:text-3xl md:text-4xl mx-4 sm:mx-6 md:mx-10 font-poppins text-white p-3 sm:p-4 md:p-5 flex justify-between items-center rounded-full">
      <div>
        <p className="font-nerko cursor-pointer" onClick={() => nav("/")}>Dasho</p>
      </div>
       {localStorage.getItem("user") ? 
      (<img src={JSON.parse(localStorage.getItem("user")).imgUrl} alt="Profile" className="h-12 w-12 rounded-full object-cover border cursor-pointer" onClick={()=>{nav("/profile")}} />)
       :
        (<button className=" text-sm" onClick={()=>{nav("/auth")}}>Sign in</button>)
      }
    </div>
  );
}

export default Navbar;
