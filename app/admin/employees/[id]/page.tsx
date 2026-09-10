import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";

export default async function SpecificEmployeePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const employeeInfo = await prisma.user.findUnique({
        select: {
            tasks: true,
            email: true,
            name: true,
        },
        where: { id },
    });

    if (!employeeInfo) {
        notFound();
    }

    return (
        <div>
            <p>{employeeInfo.name}</p>
        </div>
    )
}