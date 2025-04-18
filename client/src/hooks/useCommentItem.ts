import { UserRefType } from "../types/entityTypes";

/**
 * A custom hook to check if the currently logged-in user is the owner of a comment.
 *
 * @param userId - The user ID associated with the comment (can be string or user reference object).
 * @param currentUserId - The ID of the currently logged-in user.
 * @returns `true` if the user is the comment owner, otherwise `false`.
 */
export const useIsCommentOwner = (
  userId: string | UserRefType,
  currentUserId?: string
): boolean => {
  if (!currentUserId) return false;
  return typeof userId === "object"
    ? userId._id === currentUserId
    : userId === currentUserId;
};
