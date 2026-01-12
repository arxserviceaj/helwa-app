import React from 'react'

const HomeSectionCard = () => {
  return (
    <div className='cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-60 mx-3 '>
        <div className="h-52 w-40 ">
            <img src="" alt=""  className='object-cover object-top w-full h-full'/>
        </div>
        <div className="p-4">
            <h3 className='text-lg font-medium text-gray-900'></h3>
            <p className='mt-2 text-sm text-gray-500'></p>

        </div>

    </div>
  )
}

export default HomeSectionCard