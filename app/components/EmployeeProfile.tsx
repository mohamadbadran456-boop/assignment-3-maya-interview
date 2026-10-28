
"use client";

import { useEffect, useState } from "react";

type Employee = {
  name: string;
  email: string;
  company: {
    name: string;
  };
};

type Post = {
  id: number;
  title: string;
  body: string;
};

type Scenario = "success" | "slow" | "error" | "empty";

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function checkResponse(response: Response): Promise<Post[]> {
  if (!response.ok) {
    throw new ApiError("Failed to load posts", response.status);
  }

  return response.json();
}

export default function EmployeeProfile({
  employee,
}: {
  employee: Employee;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [scenario, setScenario] = useState<Scenario>("success");
  const [request, setRequest] = useState<{
    id: number;
    scenario: Scenario;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  // Fetch posts only after the button is clicked
  useEffect(() => {
    if (!request) return;

    const controller = new AbortController();
    let active = true;

    async function fetchPosts() {
      try {
        let response: Response;

        if (request!.scenario === "slow") {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );
        }

        if (!active) return;

        if (request!.scenario === "error") {
          response = new Response(null, { status: 503 });
        } else if (request!.scenario === "empty") {
          response = new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?userId=1",
            { signal: controller.signal }
          );
        }

        const data = await checkResponse(response);

        if (active) {
          setPosts(data);
          setLoaded(true);
        }
      } catch (err) {
        if (!active) return;

        if (err instanceof ApiError) {
          setError(`HTTP Error ${err.status}: ${err.message}`);
        } else {
          setError("Network error. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [request]);

  function loadPosts() {
    if (loading) return;

    setLoading(true);
    setLoaded(false);
    setError("");
    setPosts([]);

    setRequest({
      id: Date.now(),
      scenario,
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Employee Profile
        </h2>

        <p className="text-gray-700">
          <strong>Name:</strong> {employee.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {employee.email}
        </p>
        <p className="text-gray-700">
          <strong>Company:</strong> {employee.company.name}
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Explore All Posts
        </h2>

        <label
          htmlFor="scenario"
          className="mb-2 block font-medium text-gray-700"
        >
          Demo Scenario
        </label>

        <select
          id="scenario"
          value={scenario}
          onChange={(e) =>
            setScenario(e.target.value as Scenario)
          }
          disabled={loading}
          className="mb-4 w-full rounded-lg border p-2 text-gray-900"
        >
          <option value="success">Success (Real API)</option>
          <option value="slow">Slow (2-second delay)</option>
          <option value="error">HTTP Error (Simulated 503)</option>
          <option value="empty">Empty (Simulated Response)</option>
        </select>

        <button
          onClick={loadPosts}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {loading ? "Loading..." : error ? "Retry" : "Load Posts"}
        </button>

        {loading && (
          <p role="status" className="mt-4 text-gray-600">
            Loading posts...
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-red-600">
            {error}
          </p>
        )}

        {!loaded && !loading && !error && (
          <p className="mt-4 text-gray-500">
            Click Load Posts to explore employee posts.
          </p>
        )}

        {loaded && !loading && !error && posts.length === 0 && (
          <p className="mt-4 text-gray-600">
            No posts found.
          </p>
        )}

        {loaded && !loading && !error && posts.length > 0 && (
          <div className="mt-4 space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="rounded-lg border p-4">
                <h3 className="font-bold text-gray-900">
                  {post.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {post.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
