"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(role: "student" | "admin") {
  const email =
    role === "student" ? "student@example.com" : "admin@example.com";

  try {
    await signIn("credentials", {
      email,
      redirect: false,
    });
    return { success: true, url: role === "student" ? "/atlas" : "/admin" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
