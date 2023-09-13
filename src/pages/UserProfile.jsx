import { useNavigate, useParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import pp from '../assets/pp.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineHeart as Like, AiOutlineComment as Comment, AiOutlineCloseCircle as Close, AiOutlineSave as Save } from 'react-icons/ai'
import CustomModal from "../components/CustomModal";
import { TbGridDots } from 'react-icons/tb'
import { Dna } from 'react-loader-spinner'
import { VscVerified as Tick } from 'react-icons/vsc'


function UserProfile() {
    const { Id } = useParams()
    const navigate = useNavigate()
    const userRedux = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [hansi, setHansi] = useState('');
    const [loader, setLoader] = useState(false)
    const [showPosts, setShowPosts] = useState(true)
    const [btnLoader, setBtnLoader] = useState(false)
    const [postValue, setPostValue] = useState("");
    const [likeState, setLikeState] = useState(false);
    const [photoId, setPhotoId] = useState(-1)
    const [loading, setLoading] = useState(false);
    // async function fetchUserData() {
    //     try {
    //       setLoading(true);
    //       const response = await fetch(`https://www.api.techantgram.online/users/${Id}`, {
    //         credentials: 'include',
    //       });
    //       if (response.ok) {
    //         const data = await response.json();
    //         setUser(data);
    //       }
    //     } catch (error) {
    //       toast.error(error.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   }

   
    
    useEffect(() => {
        setLoader(true);
        
        fetch(`https://www.api.techantgram.online/users/${Id}`, {
          credentials: 'include'
        }).then(response => {
          if (response.ok) {
            response.json().then(data => {
              setLoader(false);
              setUser(data);
            });
          } else if (response.status === 404) {
            setLoader(false);
            toast.warn('This account may be banned or deleted');
          } else {
            response.json().then(err => {
              setLoader(false);
              toast.error(err.error);
            });
          }
        }).catch(err => {
          setLoader(false);
          toast.error(err.message);
        });
      }, [Id]);
      

   

    useEffect(() => {
        setFollowing(user?.followers?.some((follower) => follower._id === userRedux?._id));
    }, [user?.followers, userRedux?._id]);

    useEffect(() => {
        setLikeState(user?.posts[photoId]?.likes?.some((like) => like._id === userRedux?._id))
    }, [user?.posts[photoId]?.likes], userRedux?._id)




    const handleFollow = async () => {
        try {
            setLoading(true);
            setBtnLoader(true);

            const method = following ? 'DELETE' : 'POST';

            const response = await fetch(`https://www.api.techantgram.online/follow/${Id}`, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedUser = await response.json();

                // Update followers and following sections
                setUser((prevUser) => ({
                    ...prevUser,
                    followers: updatedUser.followers,
                    following: updatedUser.following,
                }));
                setLoading(false)
                setBtnLoader(false);
                setFollowing(!following);
            } else {
                const data = await response.json();
                toast.error(data.error);
                setLoading(false)
                setBtnLoader(false);
            }
        } catch (error) {
            toast.error(error.message);
            setBtnLoader(false);
            setLoading(false)
        }
    };


    // console.log(user);

    async function clickPhoto() {
        try {
            setLoading(true);

            const method = likeState ? 'DELETE' : 'POST';

            const response = await fetch('https://www.api.techantgram.online/like', {
                credentials: 'include',
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: user?.posts[photoId]?._id,
                }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setLikeState(!likeState);
                setUser((prevUser) => {
                    const updatedPosts = prevUser.posts.map((post) =>
                        post._id === updatedPost._id
                            ? { ...post, likes: updatedPost.likes } // Update comments and likes
                            : post
                    );
                    return { ...prevUser, posts: updatedPosts };
                });
            } else {
                toast.error('Failed to perform like action');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }




    function showFollowers() {
        setIsOpen(true);
        setHansi('followers')
    }
    function showFollowings() {
        setIsOpen(true);
        setHansi('followings')
    }
    function closeModal() {
        setIsOpen(false)
    }
    function closeModalNavigate(id) {
        setTimeout(() => {
            setIsOpen(false);
            navigate(`/users/${id}`);
        }, 100); // 
    }


    async function postComment() {
        try {
            setLoading(true);
            const response = await fetch('https://www.api.techantgram.online/comment', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({
                    comment: postValue,
                    postId: user?.posts[photoId]?._id,
                }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setUser((prevUser) => {
                    const updatedPosts = prevUser.posts.map((post) =>
                        post._id === updatedPost._id
                            ? { ...post, comments: updatedPost.comments } // Update only the comments section
                            : post
                    );
                    return { ...prevUser, posts: updatedPosts };
                });
                setLoading(false)
                setPostValue(""); // Clear the postValue after successful comment submission
            } else {
                toast.error('Failed to post comment');
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false)

        }
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
    // console.log(user);
    return (
        <section className=' pb-[100px] flex flex-col px-[10px] items-center' >
            <CustomModal isOpen={isOpen} onClose={closeModal}>
                <div className="mb-[10px] flex items-center gap-x-10 font-bold border-b-[1px] border-gray-950">
                    {hansi === 'followers' ? 'Followers' : hansi === 'followings' ? 'Followings' : ''}
                </div>

                {hansi === 'followers' &&
                    user?.followers?.map((ui, key) => (
                        <Link key={key} onClick={() => closeModalNavigate(ui?._id)} className="flex gap-x-3 items-center">
                            <div className="w-[50px] h-[50px]">
                                <img src={`https://www.api.techantgram.online/${ui?.profileImage}`} alt="profile" className="rounded-full h-full w-full" />
                            </div>
                            <p className="flex items-center gap-x-2">
                                {ui?.username}
                                {ui?.isAdmin && (
                                    <Tick size={25} fill="blue" />
                                )}
                            </p>
                        </Link>
                    ))}

                {hansi === 'followings' &&
                    user?.following?.map((ui, key) => (
                        <Link key={key} onClick={() => closeModalNavigate(ui?._id)} className="flex gap-x-3 items-center">
                            <div className="w-[50px] h-[50px]">
                                <img src={`https://www.api.techantgram.online/${ui?.profileImage}`} alt="profile" className="rounded-full h-full w-full" />
                            </div>
                            <p className="flex items-center gap-x-2">
                                {ui?.username}
                                {ui?.isAdmin && (
                                    <Tick size={25} fill="blue" />
                                )}
                            </p>
                        </Link>
                    ))}


                {hansi === "" && (
                    <>
                        {photoId !== -1 && (
                            <div className="flex items-center 796:flex-col">
                                <div className="hidden h-[500px] w-[500px]  796:hidden  justify-center items-center">
                                    <img src={`https://www.api.techantgram.online/${user?.posts[photoId]?.image}`} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col gap-y-4 p-4">
                                    <div className="flex items-center gap-x-2 border-b-[1px] p-2 flex-wrap">
                                        <div className="w-[50px] h-[50px]">
                                            <img src={`https://www.api.techantgram.online/${user?.profileImage}`} className="rounded-full object-contain h-full w-full" />
                                        </div>
                                        <p className="flex items-center gap-x-2">
                                            {user?.username}
                                            {user?.isAdmin && (
                                                <Tick size={25} fill="blue" />
                                            )}
                                        </p>
                                        <p>{user?.posts[photoId]?.caption}</p>
                                    </div>

                                    <div className="flex h-[200px] flex-col gap-y-2 overflow-y-scroll 796:h-[150px]">
                                        {user?.posts[photoId]?.comments?.map((ui, key) => (
                                            <div key={key} className="flex gap-x-4 items-center flex-wrap gap-y-1">
                                                <Link onClick={() => closeModalNavigate(ui?.user?._id)} className="flex items-center gap-x-2">
                                                    <div className="w-[50px] h-[50px]">
                                                        <img src={`https://www.api.techantgram.online/${ui?.user?.profileImage}`} className="rounded-full object-contain h-full w-full" />
                                                    </div>
                                                    <p className="flex items-center gap-x-2">
                                                        {ui?.user?.username}
                                                        {ui?.user?.isAdmin && (
                                                            <Tick size={25} fill="blue" />
                                                        )}
                                                    </p>
                                                </Link>
                                                <p className="font-bold whitespace-normal">{ui?.text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-x-4">
                                        <button disabled={loading}>
                                            <Like style={likeState && { 'color': 'red' }} onClick={clickPhoto} size={25} cursor={loading ? 'not-allowed' : 'pointer'} />
                                        </button>
                                        <Comment size={25} cursor={'pointer'} />
                                    </div>
                                    <div className="flex flex-col">
                                        <p>{user?.posts[photoId]?.likes?.length} likes</p>
                                        <p>{new Date(user?.posts[photoId]?.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <input
                                            value={postValue}
                                            onChange={(e) => setPostValue(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="focus:outline-none flex-1"
                                        />
                                        <button onClick={postComment} disabled={postValue.trim().length === 0 || loading} className="bg-green-500 disabled:opacity-50 text-white rounded-lg px-4">
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>

                        )}
                    </>
                )}
            </CustomModal>

            <div className='flex gap-x-8 items-center border-b-black border-b pb-10 500:flex-col 500:gap-y-4'>
                <div className=' w-[150px] h-[150px] object-contain '>
                    <img src={user?.profileImage ? `https://www.api.techantgram.online/${user.profileImage}` : pp} className='rounded-full h-full w-full' />
                </div>
                <div className='flex flex-col gap-y-4'>
                    <div className='flex gap-x-4 500:justify-center'>
                        <p className='cursor-pointer flex gap-x-2 items-center'>
                            {user?.username}
                            {user?.isAdmin && (
                                <Tick size={25} fill="blue" />
                            )}
                        </p>
                        {Id == userRedux?._id ? (
                            <Link to='/editprofile' className='border-[1px] px-3 border-gray-950 text-gray-950 rounded-full font-[400] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out'>Edit Profile</Link>

                        ) : (
                            <button
                                onClick={handleFollow}
                                disabled={loading}
                                type="button"
                                className='border-[1px] px-3 border-gray-950 text-gray-950 rounded-full font-[400] hover:bg-gray-950 hover:text-white transition-all duration-500 ease-in-out'
                            >
                                {btnLoader ? (
                                    <Dna
                                        visible={true}
                                        height="25"
                                        width="50"
                                        ariaLabel="dna-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="dna-wrapper"
                                    />
                                ) : (
                                    following ? 'unfollow' : 'follow'
                                )}
                            </button>


                        )}
                    </div>

                    <div className='flex gap-x-6'>
                        <h3 className='flex gap-x-1 items-center cursor-pointer'>
                            <b>{user?.posts?.length}</b> posts
                        </h3>
                        <h3 onClick={showFollowers} className='flex gap-x-1 items-center cursor-pointer'>
                            <b>{user?.followers?.length}</b> followers
                        </h3>
                        <h3 onClick={showFollowings} className='flex gap-x-1 items-center cursor-pointer'>
                            <b>{user?.following?.length}</b> following
                        </h3>
                    </div>

                    <div>
                        {user?.bio}
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-y-8 pt-3 justify-center items-center'>
                {Id === userRedux?._id && (
                    <div className='flex gap-x-6 justify-center'>
                        <button onClick={() => setShowPosts(true)} style={showPosts ? { fontWeight: 'bold' } : { fontWeight: 'normal' }} className='flex items-center gap-x-1 text-sm'><TbGridDots />POSTS</button>
                    </div>
                )}


                <div className='grid grid-cols-3 gap-x-2 gap-y-4 796:grid-cols-2 500:!grid-cols-1 '>
                    {user?.posts?.map((ui, key) => (
                        <Link key={key} onClick={() => {
                            setHansi("")
                            setPhotoId(key)
                            setIsOpen(true);
                        }} className='flex justify-center items-center relative'>
                            {/* <div className=' gap-x-2 absolute z-[50] text-white hidden group-hover:flex group-focus:none'>
                                <p className='flex items-center gap-x-1 text-black bg-white font-bold'><Like size={25} color='red' /> {ui?.likes?.length || 0}</p>
                                <p className='flex items-center gap-x-1 text-black bg-white font-bold'><Comment size={25} color='green' /> {ui?.comments?.length || 0}</p>
                            </div> */}
                            <img src={`https://www.api.techantgram.online/${ui?.image}`} className='w-[309px] h-[309px] object-cover' />
                        </Link>
                    ))}
                </div>






                <ToastContainer />
            </div>
        </section>
    )
}

export default UserProfile
