import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Dna } from 'react-loader-spinner'
import { useSelector } from "react-redux"
import { VscVerified as Tick } from 'react-icons/vsc'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pp from '../assets/pp.png'
function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true)
  const userRedux = useSelector((state) => state.user.user)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://www.api.techantgram.online/allusers', {
      credentials: 'include',
      method: 'GET'
    }).then((res) => {
      if (res.ok) {
        setLoader(false);
        res.json().then(data => {
          setUsers(data)
        })
      }
    }).catch(err => {
      setLoader(false);
      toast.error(err.message)
    })
  }, [userRedux?._id])


  if (!userRedux) {
    return <center className="pt-[100px] flex justify-center items-center">
    <h1 className=" text-gray-950 text-3xl font-[500] flex 500:text-xl">Open Accaunt🥰</h1>
    </center>
  }

  if (loader) {
    return (
      <div className="flex justify-center items-center pt-[150px]">
        <Dna
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>

    )

  }
  const usersMap = users.map((ui, key) => {
    return <Link key={key} className="flex gap-x-4 items-center" to={`/users/${ui?._id}`}>
      <div className="w-[50px] h-[50px]">
        <img src={ ui?.profileImage ? `https://www.api.techantgram.online/${ui?.profileImage}` : pp} alt="profile" className="rounded-full h-full w-full" />
      </div>
      <div className="flex gap-x-2">
        <p>{ui?.username}</p>
        
        {ui?.isAdmin ? <Tick size={25} fill="blue" /> : ''}
      </div>
    </Link>
  })

  return (
  

    <div className="flex items-center justify-center gap-y-5 pt-[50px] pb-[100px] px-6">
      <div className="flex flex-col justify-center gap-y-5">
        {usersMap}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ExplorePage
