

import { sign } from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient

//Creamos una ruta de tipo Post desde la cual recibimos el email del usuario
export async function POST(req:Request){

    const datos = await req.json()
    //Extraigo el email del usuario

    //Busco el usuario correspondiente al email que obtuvimos
    const usuario = await prisma.usuario.findUnique({
        where: {email: datos.email}
    })

    if(!usuario){//Si no existe un usuario con ese mail
        return new Response(JSON.stringify({msg: "Este usuario no existe!"}), {
            status: 400
        })
    }

    //Si hay un usuario generamos un token unico para la recuperacion de su cuenta
    
    const tokenMail = sign(
        datos.email, 
        process.env.TOKEN_SECRET as string, 
        {}
    ) 
    //El token contiene el email encriptado en base a variable de entorno 
    //Luego vamos a acceder a este desde la ruta dinamica

    //Enviar datos para la plantilla del email de recuperación que se le va a enviar al usuario
    const parametrosPlantilla = { 
        //Completamos los parametros para la plantilla del mail
        asunto: "Recupera tu contraseña",
        from_name: "Blog de Roberto",
        to_name: usuario.nombre,
        link: `http://localhost:3000/auth/recuperar/${tokenMail}`, 
        user_email: datos.email
    }

    return new Response(JSON.stringify(parametrosPlantilla))
}

