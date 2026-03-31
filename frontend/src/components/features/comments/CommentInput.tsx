import { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';

const MAX_LENGTH = 2000;
const WARN_AT = 1800;

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
}

export function CommentInput({ onSubmit, isLoading = false }: CommentInputProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;
  const remaining = MAX_LENGTH - charCount;
  const isOverLimit = charCount > MAX_LENGTH;

  const handleSubmit = () => {
    if (!content.trim() || isOverLimit) return;
    onSubmit(content.trim());
    setContent('');
    setFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="px-6 py-4 border-t border-surface-border">
      <div className="flex gap-3">
        {user && <Avatar name={user.full_name} size="sm" className="mt-0.5 shrink-0" />}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => !content && setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment... (⌘+Enter to post)"
            className={`input-field h-auto resize-none w-full transition-all duration-200 text-sm
              ${focused ? 'min-h-[80px]' : 'min-h-[40px]'}`}
            style={{ height: focused ? undefined : '40px' }}
            maxLength={MAX_LENGTH + 100}
          />
          {(focused || content) && (
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : charCount >= WARN_AT ? 'text-amber-500' : 'text-gray-400'}`}>
                {charCount} / {MAX_LENGTH}
                {remaining <= 200 && !isOverLimit && ` · ${remaining} remaining`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setContent(''); setFocused(false); }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!content.trim() || isOverLimit}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
