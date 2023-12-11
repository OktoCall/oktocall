import Image from 'next/image'

export default function Home() {
  return (
    <>
      <section className='bg-bienvenida bg-cover bg-no-repeat h-screen w-screen'>
        <section className='flex items-center justify-between'>
          <ul className='pl-18 pt-2 font-bold text-5xl'>
            <li>O</li>
            <li>K</li>
            <li>T</li>
            <li>O</li>
            <li>C</li>
            <li>A</li>
            <li>L</li>
            <li>L</li>
          </ul>
          <Image src={'/pulpito-retro.jpg'} alt={''} width={170} height={200} className='mt-5 mr-5' />
        </section>
        <section className='
        text-black font-bold text-4xl w-screen h-auto
         flex justify-center items-center flex-col pt-16'
         >
          <p>TE DAMOS LA</p>
          <p>BIENVENIDA</p>
        </section>
      </section>
    </>
  )
}
