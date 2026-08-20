import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Current Session</h1>
      <pre className="bg-gray-100 p-4 rounded text-black">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}