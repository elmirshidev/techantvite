import { Link } from "react-router-dom"
import logo from '../assets/logo.svg'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
// import { Dna } from 'react-loader-spinner'

import { auth, logout } from "../REDUX/userSlice"
import { useDispatch } from 'react-redux'
import pp from '../assets/pp.png'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { VscVerified as Tick } from 'react-icons/vsc'

function Navbar() {

  const dispatch = useDispatch()


  const user = useSelector((state) => state.user.user)



  useEffect(() => {
    fetch('http://143.42.203.226/profile', { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          dispatch(auth(true));
          response.json().then(data => {
            dispatch(auth({
              _id : data._id ,
              username: data.username,
              profileImage: data.profileImage,
              isAdmin:data.isAdmin
            }))
          })
        }
      })

      .catch(err => {
        toast.error(err.message)
      })
  }, [])


  function logoutUser() {
    fetch('http://143.42.203.226/logout', { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          dispatch(logout())
          toast.success('logged out!')
        }

      })
      .catch(err => {
        toast.error(err.message)
      })
  }
  return (
    <header className="flex items-center justify-between py-[20px] px-[30px] 500:px-[10px]">
      <Link to='/' className="flex justify-start items-center w-[100px] object-contain 500:w-[75px] ">
        <img src={logo} />
      </Link>
      <nav className="flex">
        {user ? (
          <div className="flex gap-x-4 items-center">
            <Link to={`/users/${user?._id}`} className="flex items-center gap-x-2">
              <div className="w-[50px] h-[50px]">
                <img src={user?.profileImage ? `http://143.42.203.226/${user?.profileImage}` : pp} className="rounded-full h-full w-full" />
              </div>
              <p className="370:hidden flex items-center gap-x-2">
                {user?.username}
                {user?.isAdmin && (
                   <Tick size={25} fill="blue" />
                )}
              </p>
            </Link>
            <button onClick={logoutUser} className="px-[20px] py-[10px] border-2 border-gray-950 text-gray-950 rounded-full font-[800] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-x-4">
            <Link to='/register' className="px-[20px] py-[10px] border-2 border-gray-950 text-gray-950 rounded-full font-[800] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out">
              Register
            </Link>
            <Link to='/login' className="px-[20px] py-[10px] border-2 border-gray-950 text-gray-950 rounded-full font-[800] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out">
              Login
            </Link>
          </div>
        )}
        <ToastContainer />

      </nav>
    </header>
  )
}

export default Navbar
