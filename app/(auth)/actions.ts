"use server";

// Auth actions simplified - no database required
// Guest-only authentication is handled in auth.ts

export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
};

// Login is disabled - guests only
export const login = async (
  _: LoginActionState,
  _formData: FormData
): Promise<LoginActionState> => {
  return { status: "failed" };
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

// Registration is disabled - guests only
export const register = async (
  _: RegisterActionState,
  _formData: FormData
): Promise<RegisterActionState> => {
  return { status: "failed" };
};
