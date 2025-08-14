// import React,{useContext} from 'react';
// import {UserContext} from "../../context/userContext";
// import Navbar from "./Navbar";
// import SideMenu from "./SideMenu";

// const DashboardLayout=({children,activeMenu})=>{
//     const {user}=useContext(UserContext);
//     return(
//         <div className=''>
//             <Navbar activeMenu={activeMenu} />

//             {user && (
//                 <div className="flex">
//                     <div className="max-[1080px]:hidden">
//                         <SideMenu activeMenu={activeMenu} />
//                     </div>

//                     <div className='grow mx-5'>{children}</div>
//                 </div>
//             )}
//         </div>
//     );
// };
// export default DashboardLayout;

import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar activeMenu={activeMenu} />

      <div className="flex flex-1">
        {/* Side Menu - visible on desktop, hidden on mobile */}
        <div className="hidden md:block w-64 bg-white shadow-md">
          <SideMenu activeMenu={activeMenu} />
        </div>

        {/* Main Content */}
        <div className="flex-1 mx-5">
          {/* Optional: only show children if user is loaded */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
