import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Tenta conexão com BD
        const userCount = await db.user.count();

        if (userCount === 0) {
            // Cria usuário padrão
            const user = await db.user.create({
                data: {
                    name: "Gabriel",
                    email: "gabriel@birivibe.com",
                    timezone: "America/Sao_Paulo",
                }
            });

            return NextResponse.json({
                status: "initialized",
                message: "Usuário Gabriel criado com sucesso!",
                user: { id: user.id, name: user.name, email: user.email }
            });
        }

        // Busca primeiro usuário para diagnóstico
        const firstUser = await db.user.findFirst();

        return NextResponse.json({
            status: "ok",
            message: `BD conectado. ${userCount} usuário(s) encontrado(s).`,
            user: firstUser ? { id: firstUser.id, name: firstUser.name, email: firstUser.email } : null
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        return NextResponse.json({
            status: "error",
            message: "Erro ao conectar com banco de dados",
            error: errorMessage,
            hint: "Verifique se DATABASE_URL está configurada corretamente no Railway"
        }, { status: 500 });
    }
}
