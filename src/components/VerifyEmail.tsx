"use client"

import { trpc } from "@/trpc/client"
import { Loader2, XCircle } from "lucide-react"
import Image from "next/image"
import { buttonVariants } from "./ui/button"
import Link from "next/link"

interface VerifyEmailProps {
    token: string

}

const VerifyEmail = ({ token }: VerifyEmailProps) => {

    const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
        token,
    })

    if (isError) {
        return <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-600" />
            <h3 className="font-semibold text-xl">Houve um problema</h3>
            <p className="text-muted-foreground text-sm">
                Seu token expirou ou é inválido.
                Por favor tente novamente.
            </p>
        </div>
    }

    if (data?.success) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <div className="relative mb-4 h-96 w-96 text-muted-foreground">
                    <Image
                        src="/sent-email.png"
                        fill
                        alt="email sent" />

                </div>

                <h3 className="font-semibold text-2xl">
                    Tudo pronto!
                </h3>
                <p className="text-muted-foreground text-center mt-1">
                    Obrigado por verificar seu email.
                </p>
                <Link
                    className={buttonVariants({ className: "mt-4" })}
                    href="/sign-in">
                    Entrar
                </Link>
            </div>

        )
    }

    if (isLoading) {
        return <div className="flex flex-col items-center gap-2">
            <Loader2 className=" animate-spin h-8 w-8 text-zinc-300" />
            <h3 className="font-semibold text-xl">Verificando...</h3>
            <p className="text-muted-foreground text-sm">
                Aguarde. Não vai demorar.
            </p>
        </div>

    }

}

export default VerifyEmail