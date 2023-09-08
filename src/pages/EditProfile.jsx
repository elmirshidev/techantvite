import pp from '../assets/pp.png'

import { Dna } from 'react-loader-spinner'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../REDUX/userSlice';
function EditProfile() {
  const [user, setUser] = useState(null)
  const userRedux = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  useEffect(() => {
    fetch('http://143.42.203.226/myprofile', {
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          setUser(data)
        })
      }
    }).catch(err => {
      toast.error(err.message)
    })
  }, [])

    const [loader, setLoader] = useState(false);
    const navigate = useNavigate()
    const [file,setFile] = useState("")
    const [username,setUsername] = useState("")
    const [bio,setBio] = useState("")
 
    function changeProfile() {
        setLoader(true);
        const formData = new FormData()
        formData.set('username', username)
        formData.set('bio', bio)
        formData.append('file', file[0])
        fetch('http://143.42.203.226/editprofile', {
            credentials: "include",
            method: 'PUT',
            body: formData
        }).then(response => {
            if (response.ok) {
              response.json().then(data => {
                setLoader(false);
                dispatch(auth({
                  username:data.username,
                  profileImage:data.profileImage,
                  _id:data._id
                }))
                navigate(`/users/${userRedux?._id}`)

              })  
                
            } else {
                setLoader(false)
                response.json().then(data => {
                    toast.error(data.err)
                })
            }
        }).catch(err => {
            setLoader(false);
            toast.error(err.message)
        })
    }

    return (
        <section className='flex flex-col gap-y-4 items-center'>
            <div className='w-[100px] h-[100px]'>
                <img src={user?.profileImage ? `http://143.42.203.226/${user.profileImage}` : pp} className='rounded-full h-full w-full' />
            </div>

            <div className='flex justify-center items-center container'>
               <form className='w-[500px] px-6 flex flex-col gap-y-4' encType='multipart/form-data'>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="file">Upload New Img</label>
                        <input  onChange={e => setFile(e.target.files)} type='file' name='image' placeholder='img' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                    </div>

                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="username">New Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} name='username' placeholder='username' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                    </div>

                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="bio">New Bio</label>
                        <input type="text" value={bio} onChange={e => setBio(e.target.value)} name='bio' placeholder='bio' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]'/>
                    </div>
                    <div className='flex justify-end'>
                      <button type='button' onClick={changeProfile}  className='px-[20px] w-[50%] disabled:opacity-50 py-[10px] border-2 border-green-500 text-gray-950 rounded-full font-[800] hover:bg-green-500 hover:text-white transition-all duration-500 ease-in-out'>Submit</button>
                    </div>
               </form>
            </div>
            <ToastContainer />
        </section>
    )
}

export default EditProfile
