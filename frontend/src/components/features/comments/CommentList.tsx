import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Comment } from '../../../types';
import { Avatar } from '../../ui/Avatar';
import { formatRelative } from '../../../utils/date';

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function CommentList({
  comments, currentUserId, isAdmin, onDelete, onUpdate, isDeleting, isUpdating,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = (commentId: string) => {
    if (editContent.trim()) {
      onUpdate(commentId, editContent.trim());
      cancelEdit();
    }
  };

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-border">
      {comments.map((comment) => {
        const isAuthor = comment.author.id === currentUserId;
        const canEdit = isAuthor;
        const canDelete = isAuthor || isAdmin;
        const isEditing = editingId === comment.id;
        const wasEdited = comment.updated_at && comment.updated_at !== comment.created_at;

        return (
          <div key={comment.id} className="px-6 py-4 group">
            <div className="flex gap-3">
              <Avatar name={comment.author.full_name} size="sm" />
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-900">{comment.author.full_name}</span>
                    {wasEdited && (
                      <span className="text-2xs text-gray-400">(edited)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 shrink-0">{formatRelative(comment.created_at)}</span>
                    {/* Actions (show on hover) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canEdit && !isEditing && (
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Edit comment"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(comment.id)}
                          disabled={isDeleting}
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      className="input-field h-auto resize-none text-sm"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(comment.id)}
                        disabled={!editContent.trim() || isUpdating}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand text-white rounded-md hover:bg-brand-hover transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
