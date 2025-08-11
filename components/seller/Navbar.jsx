import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <div className="cursor-pointer w-28 md:w-32 flex items-center justify-center md:gap-2">
        <span className="text-orange-600 font-extrabold text-2xl md:text-3xl">E</span>
        <span className="text-xl md:text-2xl "> Commerce</span>
      </div>
      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar