"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // const router = useRouter();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   // Check if user is authenticated by looking for a token in localStorage
  //   const token = localStorage.getItem("authToken"); // Replace "authToken" with your actual token key
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     router.push("/sign-in"); // Redirect to sign-in if not authenticated
  //   }
  // }, [router]);

  return (
    <>
      <main className="flex flex-col flex-grow items-center">
        <h1 className="text-3xl font-bold mt-8">Home page</h1>
      </main>
    </>
  );
}
