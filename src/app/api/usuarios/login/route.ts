import { emailRegex, passwordRegex } from "@/utils/regex";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const usuario = await req.json();

  if (!usuario.email.match(emailRegex))
    return new Response(JSON.stringify({msg: "Email invalido!"}), { status: 400 });

  if (!usuario.password.match(passwordRegex))
    return new Response(JSON.stringify({msg: "Contraseña invalida!"}), { status: 400 });

  const usuarioDeBase = await prisma.usuario.findUnique({
    where: {
      email: usuario.email,
    },
  });

  if (!usuarioDeBase) return new Response(JSON.stringify({msg: "La cuentra ingresada no existe!"}), { status: 403 });

  const passwordValida = await compare(
    usuario.password,
    usuarioDeBase.password
  );

  if (!passwordValida)
    return new Response(JSON.stringify({msg: "Contraseña invalida!"}), { status: 401 });

  const token = sign(usuarioDeBase, process.env.TOKEN_SECRET as string, {
    expiresIn: "7d",
  });

  return new Response(token, { status: 200 });
}