"use client"
import { UserContext } from "@/context/UserContext"
import { decode } from "jsonwebtoken"
import { useRef, useContext, FormEvent } from "react"


export default function Page({params} : any){

  const passwordRef = useRef(null)

  //Obtengo el email encriptado del usuario, desde el parametro
  const emailUsuario = params.tokenMail
  
  //Decodifico el email
  const emailDecodificado = decode(emailUsuario)

  async function enviarDatos(evento: FormEvent){
    evento.preventDefault()
      
    const datosAEnviar = {
      email: emailDecodificado,
      //@ts-ignore
      password: passwordRef.current?.value
    }

    console.log(datosAEnviar)

    const respuesta = await fetch("http://localhost:3000/api/recuperar/cambio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      //@ts-ignore
      body: JSON.stringify(datosAEnviar)
      //Enviamos la nueva contraseña y el mail, para que la reciba el back y pueda realizar el cambio
    })

    if(respuesta.status == 400){
      const error = await respuesta.json() 
      return new Response (JSON.stringify({msg: "Hubo un error: " + error.msg}), {status: 400})
    }
      
  }

  return (

    <form onSubmit= {enviarDatos} className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-5 sm:mx-auto sm:w-full sm:max-w-sm">

      <div>
        <label htmlFor="email" className="block text-m font-medium leading-6 text-white">
              Contraseña nueva
        </label>
        <div className="mt-5">
          <input ref={passwordRef}
            type="password" 
            className="block w-full rounded-md border-0 px-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="mt-3">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cambiar contraseña
          </button>
      </div>
    </form>
  )
}