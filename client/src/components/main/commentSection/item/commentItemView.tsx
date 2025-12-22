import React, { useState } from "react";
import { useIsCommentOwner } from "../../../../hooks/useCommentItem";
import { CommentType, UserRefType } from "../../../../types/entityTypes";
import { getMetaData } from "../../../../utils";

/**
 * Props for the CommentItem component.
 * Includes the comment data, current user ID, and edit/delete handlers.
 */
interface Props {
  comment: CommentType;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Renders a single comment item with conditional edit/delete options
 * if the current user is the comment owner.
 */
const CommentItem = ({ comment, currentUserId, onEdit, onDelete }: Props) => {
  const isOwner = useIsCommentOwner(comment.userId, currentUserId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const authorName =
    typeof comment.userId === "string"
      ? "Unknown user"
      : (comment.userId as UserRefType).displayName;

  const createdMeta =
    comment.createdAt ? getMetaData(new Date(comment.createdAt)) : null;

  return (
    <>
      <li className="comment-item">
        <div className="comment_text">
          {comment.isDeleted ? "[deleted]" : comment.text}
        </div>
        <div className="comment_meta_wrapper">
          {!comment.isDeleted && (
            <div className="comment_meta">
              <span className="comment_author">{authorName}</span>
              {createdMeta && (
                <span className="comment_time">{createdMeta}</span>
              )}
            </div>
          )}
          {isOwner && !comment.isDeleted && (
            <div className="comment-actions">
              <button onClick={onEdit}>Edit</button>
              <button onClick={() => setShowDeleteModal(true)}>Delete</button>
            </div>
          )}
        </div>
      </li>

      {showDeleteModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete comment</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowDeleteModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setShowDeleteModal(false);
                      onDelete();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </>
  );
};

export default CommentItem;
