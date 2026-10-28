
import { Suspense } from "react";
import EmployeeProfile from "./components/EmployeeProfile";

type Employee = {
  name: string;
  email: string;
  company: {
    name: string;
  };
};

async function EmployeeSection() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
      
    );

    if (!response.ok) {
      throw new Error("Failed to load employee");
    }

    const employee: Employee = await response.json();

    return <EmployeeProfile employee={employee} />;
  } catch {
    return (
      <p className="rounded bg-red-50 p-4 text-red-700">
        Unable to load employee information.
      </p>
    );
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Employee Explorer
        </h1>

        <Suspense fallback={<p>Loading employee...</p>}>
          <EmployeeSection />
        </Suspense>
      </div>
    </main>
  );
}
