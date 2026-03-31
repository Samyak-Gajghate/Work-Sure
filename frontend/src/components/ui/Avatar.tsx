import { getInitials, getAvatarColor } from '../../utils/avatar';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-5 h-5 text-[8px]',
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-14 h-14 text-lg',
};

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const color = getAvatarColor(name);
  return (
    <div
      className={`${sizeMap[size]} ${color} rounded-full flex items-center justify-center
        text-white font-semibold shrink-0 select-none ${className}`}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
