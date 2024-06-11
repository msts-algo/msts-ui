import './App.css';
import { useEffect, useState } from 'react';
import {BsArrowLeftShort} from 'react-icons/bs';
import { FaBuilding } from "react-icons/fa";
import sidebarData from './ui-components/sidebar.json';
import { Link, Outlet } from 'react-router-dom';

export default function App() {
  const [open, setOpen] = useState(true);
  const [componentsData, setComponentsData] = useState([])

  useEffect(() => {
      setComponentsData(sidebarData);
  }, [])
  return (
    <div className='flex'>
      <div className={`bg-gray-100 h-screen text-white p-5 pt-8 ${open ? 'w-72': 'w-20'} duration-300 relative`}>
        <BsArrowLeftShort className={`bg-white text-black rounded-full text-3xl absolute -right-3 top-9 border border-blue-500 cursor-pointer ${!open && 'rotate-180'}`}
          onClick={() => setOpen(!open)}/>
        <div className='inline-flex'>
          <Link to="/">
            <FaBuilding className={`bg-orange-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${open && 'rotate-[360deg]'}`}/>
            <h1 className={`text-black origin-left font-medium text-2xl duration-300 ${!open && 'scale-0'}`}>MSTS</h1>
          </Link>
        </div>

        <div className={`cursor-pointer text-white`}>
        {
          componentsData.map((item, index) => (
            <Link to={item.href}>
              <ul key={index} value={item.details} className={`text-black mt-5 p-1 text-1xl hover:bg-blue-500 hover:text-white rounded ${!open && 'invisible'}`}>{item.title}</ul>
            </Link>
          ))
        }
        </div>
      </div>

      <div className='p-7 w-full'>
        <Outlet/>
      </div>
    </div>
  )
}
