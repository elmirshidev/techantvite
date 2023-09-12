import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Dna } from 'react-loader-spinner'
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { auth,logout } from "../REDUX/userSlice"
import { useDispatch } from 'react-redux'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false);

    const registerValid = Yup.object().shape({
        username: Yup.string().when('step', {
            is: 1,
            then: schema => schema.required().min(5,'username must be at least 5 characters').max(20,'Username must be at most 20 characters')
        }),
        password: Yup.string().when('step', {
            is: 1,
            then: schema => schema.required().min(5,'password must be at least 5 characters')
        }),
        email: Yup.string().when('step', {
            is: 2,
            then: schema => schema.required().email('invalid email format')
        }),
        code: Yup.string().when('step', {
            is: 3,
            then: schema => schema.required().length(4, 'Code must be exactly 4 characters')
        })
    })


    function handleCode(values, setFieldValue) {
        setLoader(true)
        fetch('https://www.api.techantgram.online/verifyemail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: values.email
            })
        })
            .then(response => {
                if (response.ok) {
                    setLoader(false);
                    setFieldValue('step', values.step + 1);
                } else {
                    setLoader(false)
                    throw new Error('Email verification failed.');
                }
            })
            .catch(error => {
                setLoader(false);
                toast.error(error.message)
            });
    }

    function registerUser(values, setFieldValue) {
        setLoader(true)
        fetch('https://www.api.techantgram.online/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: values.username,
                pass: values.password,
                email: values.email,
                code: values.code
            })
        })
            .then(response => {
                if(response.ok) {
                    setLoader(false);
                    response.json().then(data => {
                        dispatch(auth({
                            username: data.username,
                            _id: data._id,
                            profileImage: data.profileImage,
                            isAdmin:data.isAdmin
                        }))
                    })
                    navigate('/');
                } else {
                    setLoader(false)
                    response.json().then(data => {
                      toast.error(data.err)
                    })
                }
            }).catch(error => {
                setLoader(false);
                toast.error(error.message)
            })
    }


    function prevHandle(values, setFieldValue) {

        setFieldValue('step', values.step - 1)
    }
    function nextHandle(values, setFieldValue) {

        setFieldValue('step', values.step + 1)
    }







  
        return (
            <div className='flex justify-center items-center pt-[150px]'>


                <Formik
                    validationSchema={registerValid}
                    initialValues={{
                        //step 1

                        step: 1,

                        username: '',
                        password: '',
                        //step 2

                        email: '',

                        //step 3

                        code: ''
                    }}
                >

                    {({ values, setFieldValue, isValid, dirty }) => (
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
                                <Form className='w-[500px] px-6 flex flex-col'>
                                    {values.step === 1 && (
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
                                    )}

                                    {values.step === 2 && (
                                        <div>
                                            <Field name='email' placeholder='email' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                                            <ErrorMessage name='email' component='small' className='block text-xs text-red-600 mt-1' />
                                        </div>
                                    )}
                                    {values.step === 3 && (
                                        <div>
                                            <Field name='code' placeholder='code' className='h-10 rounded px-4 outline-none border-2 border-gray-950 w-[100%]' />
                                            <ErrorMessage name='code' component='small' className='block text-xs text-red-600 mt1' />
                                        </div>
                                    )}



                                    <div className='grid grid-cols-2 gap-x-4 mt-4'>
                                        {values.step > 1 && values.step != 3 && (
                                            <button onClick={() => prevHandle(values, setFieldValue)} className='px-[20px] py-[10px] border-2 border-gray-950 text-gray-950 rounded-full font-[800] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out' >Prev</button>
                                        ) || <div />}
                                        {values.step < 2 && (
                                            <button onClick={() => nextHandle(values, setFieldValue)} disabled={!isValid || !dirty} className='px-[20px] disabled:opacity-50 py-[10px] border-2 border-gray-950 text-gray-950 rounded-full font-[800] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out' >Next</button>
                                        )}
                                        {
                                            values.step == 2 && (
                                                <button onClick={() => handleCode(values, setFieldValue)} disabled={!isValid || !dirty} className='px-[20px] disabled:opacity-50 py-[10px] border-2 border-orange-600 text-gray-950 rounded-full font-[800] hover:bg-orange-600 hover:text-white transition-all duration-500 ease-in-out' >Send Code</button>
                                            )
                                        }
                                        {
                                            values.step == 3 && (
                                                <button type='button' onClick={() => registerUser(values, setFieldValue)} disabled={!isValid || !dirty} className='px-[20px] disabled:opacity-50 py-[10px] border-2 border-green-500 text-gray-950 rounded-full font-[800] hover:bg-green-500 hover:text-white transition-all duration-500 ease-in-out'>Submit</button>
                                            )
                                        }
                                    </div>


                                </Form>
                            )}
                            <ToastContainer />
                        </>

                    )}

                </Formik>

            </div>
        )
    }






export default RegisterScreen
