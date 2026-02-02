"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("credentials", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "default" }),
          "bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3"
        )}
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.userAlt className="mr-2 h-4 w-4" />
        )}
        Entrar como Gabriel
      </button>
      <p className="text-xs text-center text-muted-foreground">
        Login simplificado para produção inicial
      </p>
    </div>
  )
}

