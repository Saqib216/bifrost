import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function getAccentColor() {
    const session = await auth();
    if (!session?.user?.id) return "MAGENTA" as const;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { accentColor: true },
    });
    return user?.accentColor ?? "MAGENTA";
}