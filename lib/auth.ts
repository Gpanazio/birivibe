import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { db } from "@/lib/db"

// Função helper para garantir que existe um usuário no BD
async function ensureDefaultUser() {
  let user = await db.user.findFirst();
  if (!user) {
    // Cria usuário padrão Gabriel se não existir
    user = await db.user.create({
      data: {
        name: "Gabriel",
        email: "gabriel@birivibe.com",
        timezone: "America/Sao_Paulo",
      }
    });
    console.log("✅ Usuário padrão Gabriel criado automaticamente");
  }
  return user;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    // Login direto - cria/usa usuário Gabriel automaticamente
    CredentialsProvider({
      name: "Entrar",
      credentials: {},
      async authorize() {
        try {
          const user = await ensureDefaultUser();
          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.error("❌ Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      try {
        // Busca ou cria usuário
        const dbUser = await ensureDefaultUser();
        
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          picture: dbUser.image,
        }
      } catch (error) {
        console.error("❌ Erro no JWT callback:", error);
        if (user) {
          token.id = user?.id
        }
        return token
      }
    },
  },
}
