import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Dna } from 'react-loader-spinner'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


import { auth,logout } from "../REDUX/userSlice"
import { useDispatch } from 'react-redux'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginScreen() {

    const dispatch = useDispatch()


    const loginValid = Yup.object().shape({
        username: Yup.string().required().min(5, 'username must be at least 5 characters').max(20, 'Username must be at most 20 characters'),
        password: Yup.string().required().min(5, 'password must be at least 5 characters')
    })
// 
// 
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false);

    function loginUser(values) {
        setLoader(true)
        fetch('https://www.api.techantgram.online/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify({
                username: values.username,
                pass: values.password
            })
        })
            .then(response => {
                if (response.ok) {
                    setLoader(false)
                    response.json().then(data => {
                        dispatch(auth({
                            username:data.username,
                            _id:data._id,
                            profileImage: data.profileImage,
                            isAdmin:data.isAdmin
                        }))
                    })
                    navigate('/')
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
        <div className='flex justify-center items-center pt-[150px]'>
            <Formik
                validationSchema={loginValid}
                initialValues={{
                    username: '',
                    password: ''
                }}
            >
                {({ values, isValid, dirty }) => (
                    <>
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
                            <form className='w-[500px] px-6 flex flex-col gap-y-4'>
                                <div className='flex flex-col gap-y-4'>
                                    <div >
                                        <Field name='username' placeholder='username' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                                        <ErrorMessage name='username' component='small' className='block text-xs text-red-600 mt-1' />
                                    </div>
                                    <div >
                                        <Field name='password' type='password' placeholder='password' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                                        <ErrorMessage name='password' component='small' className='block text-xs text-red-600 mt-1' />
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <button onClick={() => loginUser(values)} disabled={!isValid || !dirty} type='button' className='px-[20px] w-[50%] disabled:opacity-50 py-[10px] border-2 border-green-500 text-gray-950 rounded-full font-[800] hover:bg-green-500 hover:text-white transition-all duration-500 ease-in-out'>Submit</button>
                                </div>
                            </form>
                        )}

                        <ToastContainer />
                    </>
                )}
            </Formik>
        </div>
    )
}

export default LoginScreen
