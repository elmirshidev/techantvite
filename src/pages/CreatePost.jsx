import { useState } from "react"

import {  useNavigate } from 'react-router-dom';
import { Dna } from 'react-loader-spinner'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";


function CreatePost() {
    const navigate = useNavigate()
    const [file, setFile] = useState('');
    const [caption, setCaption] = useState('')
    const userRedux = useSelector((state) => state.user.user)
    const [loader, setLoader] = useState(false);

    function newPost(){
        setLoader(true);
        const formData = new FormData()
        formData.set("caption",caption);
        formData.append("file" , file[0])
        fetch('https://www.api.techantgram.online/createpost' , {
            credentials:'include',
            method:'POST',
            body:formData
        }).then(response => {
            if(response.ok) {
                setLoader(false);
                navigate(`/users/${userRedux?._id}`)
            } else {
                response.json().then(data => {
                    setLoader(false);
                    toast.error(data.err)
                })
            }
        }).catch(err => {
            setLoader(false);
            toast.error(err.message)
        })
    }

    if(!userRedux){
        return <center className="pt-[100px] flex justify-center items-center">
            <h1 className=" text-gray-950 text-3xl font-[500] flex 500:text-xl">Open Accaunt🥰</h1>
            </center>

    }
    return (
        <section className='flex pt-[50px] justify-center items-center container'>
            {loader && (
                <Dna
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            )}
            {!loader && (
                <form className='w-[500px] px-6 flex flex-col gap-y-4' encType='multipart/form-data'>
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="image">Post Image</label>
                        <input onChange={e => setFile(e.target.files)} name="image" type="file" placeholder="image" className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="caption">Caption</label>
                        <textarea value={caption} onChange={e => setCaption(e.target.value)} name="caption" type="text" placeholder="caption" className='h-20 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                    </div>
                    <div className="flex justify-end">
                        <button type='button' onClick={newPost} className='px-[20px] w-[50%] disabled:opacity-50 py-[10px] border-2 border-green-500 text-gray-950 rounded-full font-[800] hover:bg-green-500 hover:text-white transition-all duration-500 ease-in-out'>Submit</button>
                    </div>
                </form>
            )}
                <ToastContainer />
        </section>
    )
}

export default CreatePost
