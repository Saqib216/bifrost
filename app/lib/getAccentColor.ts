import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function getAccentColor() {
    const session = await auth();
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { accentColor: true },
        });
        return user?.accentColor ?? "MAGENTA";
    }

    const cookieStore = await cookies();
    const stored = cookieStore.get('accent')?.value?.toUpperCase();

    if (stored === 'MAGENTA' || stored === 'BLUE' || stored === 'AMBER' || stored === 'VIOLET') {
        return stored;
    }
    return 'MAGENTA';
}