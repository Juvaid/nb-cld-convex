import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Validates that the current request is authorized as an admin.
 * @param ctx Convex context
 * @param token Session token provided by the client
 * @param action Human-readable name of the action for logging
 * @returns The user object if valid
 * @throws Error if unauthorized
 */
export async function validateAdmin(
  ctx: QueryCtx | MutationCtx,
  token: string | undefined,
  action: string
) {
  if (!token) {
    console.error(`[AUTH_FAILURE] Missing token for action: ${action}`);
    throw new Error("Authentication required");
  }

  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    console.error(`[AUTH_FAILURE] Invalid or expired session for action: ${action}`);
    throw new Error("Session expired or invalid");
  }

  const user = await ctx.db.get(session.userId);
  if (!user || user.role !== "admin") {
    console.error(`[AUTH_FAILURE] Unauthorized access attempt`, {
      action,
      userId: user?._id,
      userRole: user?.role,
    });
    throw new Error("Unauthorized. Admin access required.");
  }

  return user;
}
