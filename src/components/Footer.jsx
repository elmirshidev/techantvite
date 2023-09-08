import { AiFillHome as Home, AiOutlinePlusCircle as Plus } from 'react-icons/ai'
import { MdTravelExplore as Explore } from 'react-icons/md'
import { Link } from 'react-router-dom'
function Footer() {
  return (
    <div className="h-[50px] border-t border-black w-[100%] bg-gray px-[20px] flex items-center justify-center gap-x-10">
      <Link to='/'>
         <Home size={32} className='hover:scale-125 transition-all duration-500 ease-in-out'  />
      </Link>

      <Link to='/explore'>
        <Explore size={32} className='hover:scale-125 transition-all duration-500 ease-in-out' />      
      </Link>

      <Link to='/createpost'>
          <Plus size={32} className='hover:scale-125 transition-all duration-500 ease-in-out' />
      </Link>
    </div>
  )
}

export default Footer
