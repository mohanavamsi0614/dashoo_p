import GoogleAuth from "./firebase";

function Navbar() {

  return (
    <div className="text-4xl ml-10 mr-10 font-poppins text-white p-5 flex justify-between items-center rounded-full">
      <div>
        <p
          className="font-nerko cursor-pointer"
        >
          Dasho
        </p>
      </div>
       {localStorage.getItem("user") ? 
      (<img src={JSON.parse(localStorage.getItem("user")).imgUrl} alt="Profile" className="h-12 w-12 rounded-full object-cover border" />)
       :
        (<button className=" text-sm"><GoogleAuth text="Sign in" /></button>)
      }
    </div>
  );
}

export default Navbar;
