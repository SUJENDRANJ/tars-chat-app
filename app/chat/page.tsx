"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export default function InitUser() {
  const createUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    createUser({
      clerkId: "123",
      name: "John Doe",
      email: "john.doe@example.com",
      imageUrl: "https://example.com/john.jpg",
    });
  }, []);

  return null;
}
