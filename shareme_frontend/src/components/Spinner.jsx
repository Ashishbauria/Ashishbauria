import React from 'react'


const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <p type='circles' color='#000' height={40} width={200} className="m-5"/>
      <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner
