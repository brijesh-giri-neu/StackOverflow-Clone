// hooks/useIsCommentOwner.ts
import { UserRefType } from "../types/entityTypes";

/**
 * Determines if the current user is the owner of a comment.
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
