import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <header className='max-w-[100%] w-full shadow' >
        <nav className='w-full grid grid-cols-2'>
            <aside>
                <Image className='' src={"/Youtube-Logo.jpg"} width={150} height={100} alt='logo' />
            </aside>
        </nav>
    </header>
  )
}
