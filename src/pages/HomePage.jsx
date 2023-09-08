import { motion,useSpring,useMotionValue  } from 'framer-motion'
import { useEffect } from 'react'
import { GiAnt } from 'react-icons/gi'
function HomePage() {
  // transition-all duration-500 ease-in-out //
  // const x = useMotionValue(0)
  // const spring = useSpring(x ,  { stiffness: 1000, damping: 10 })
  const x = useSpring(0, { stiffness: 1000 });
  const y = useSpring(x, { damping: 7 });

  return (
    <div className='flex justify-center items-center pt-[150px]'>
      <motion.h1 
      style={{ x,y }}
      initial={{ opacity: 0,y: 500 }}
      animate={{ opacity: 1,y : 0 }}
    transition={{ ease:'easeInOut', duration: 0.5 }} className='text-gray-950 text-7xl font-[800] flex 500:text-5xl'>TechAnt <GiAnt /></motion.h1>
    </div>
  )
}

export default HomePage
