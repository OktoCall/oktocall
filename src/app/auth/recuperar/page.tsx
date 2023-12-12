"use client"    

import { send } from "@emailjs/browser"
import { FormEvent, useContext, useRef, useState } from "react"
import { UserContext } from "@/context/UserContext"

export default function Page(){

    const emailRef = useRef(null)
    const [mailEnviado, setEnviado] = useState(false)

    //Importo el Contexto
    const {user, setUser} = useContext(UserContext)

    async function recuperarContrasena(evento: FormEvent){
        evento.preventDefault()

        //Obtengo el mail ingresado por el usuario
        //@ts-ignore
        const emailUsuario = emailRef.current?.value

        /*Hago una peticion a mi ruta del backend para enviarle el mail 
         del usuario, y luego obtener la respuesta con los datos de la platilla */
        const respuesta = await fetch("http://localhost:3000/api/recuperar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //@ts-ignore
            body: JSON.stringify({email: emailUsuario})
            //Le enviamos el email que obtenemos desde el input del formulario
        })

        if(respuesta.status != 403){
        return new Response (JSON.stringify({msg: "No existe una cuenta asociada a ese mail!"}), {status: 403})
        }

        /*Obtenemos como respuesta de la peticion a nuestra ruta de back los parametros para la platilla */
        const parametrosPlantilla = await respuesta.json()

        //Ejecutamos send, para enviar el mail de recuperacion
        send("service_bvpyclx", //serviceID
            "template_7rq6kwd", // templateID
            parametrosPlantilla, //parametros
            "5JKfyt7Q1Gv4OsuhF"//Llave publica
        )      
        
        setEnviado(true)

        //@ts-ignore
        console.log(emailUsuario)
        
        //Lo ingreso como valor de "email" en el contexto
        setUser(emailUsuario)
        
    }

    return (
        <section>
        { //Si el emailEnviado no es true (no se envio), va a mostrar el form
        mailEnviado != true ? (

        <form onSubmit={recuperarContrasena} className="text-black">

            <div>
              <label htmlFor="email" className="block text-m font-medium leading-6 text-white">
                    Email de recuperacion
              </label>
              <div className="mt-5">
                <input ref={emailRef}
                  type="email" 
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-3">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Enviar email de recuperacion
                </button>
            </div>

        </form>

        ) : ( // Si el mail se envio, cambio la interfaz por:
            <h2>Mail enviado exitosamente! revisá tu correo</h2>
        )
    }
    </section>
    )

}