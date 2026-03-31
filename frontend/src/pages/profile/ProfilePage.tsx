import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import { AppShell } from '../../components/layout/AppShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { extractApiError } from '../../utils/format';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Minimum 2 characters').max(150),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Required'),
    new_password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/\d/, 'Must include a number')
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must include a special character'),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const {
    register: rProfile,
    handleSubmit: hProfile,
    formState: { errors: eProfile, isSubmitting: sProfile },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { full_name: user?.full_name ?? '' },
  });

  const {
    register: rPwd,
    handleSubmit: hPwd,
    reset: resetPwd,
    formState: { errors: ePwd, isSubmitting: sPwd },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (d: ProfileForm) => usersApi.updateProfile(d),
    onSuccess: () => {
      refreshUser();
      showToast('Profile updated successfully', 'success');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (d: PasswordForm) =>
      usersApi.updateProfile({
        current_password: d.current_password,
        new_password: d.new_password,
      }),
    onSuccess: () => {
      resetPwd();
      showToast('Password changed successfully', 'success');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        {/* Profile Info Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="border-t border-gray-100 pt-5">
            {/* Avatar Row */}
            <div className="flex items-center gap-4 mb-6">
              {user && <Avatar name={user.full_name} size="xl" />}
              <div>
                <p className="font-semibold text-gray-900 text-lg">{user?.full_name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                {user?.role && <div className="mt-1"><RoleBadge role={user.role} /></div>}
              </div>
            </div>

            <form onSubmit={hProfile((d) => updateProfileMutation.mutate(d))} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your full name"
                error={eProfile.full_name?.message}
                {...rProfile('full_name')}
              />
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    value={user?.email ?? ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[6px] bg-gray-50 text-gray-400 pr-9"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <input
                    value={user?.role ?? ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[6px] bg-gray-50 text-gray-400 pr-9"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Role is managed by your Admin</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={sProfile}>Save Changes</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Change Password</h2>
          </div>
          <div className="border-t border-gray-100 pt-5">
            <form onSubmit={hPwd((d) => changePasswordMutation.mutate(d))} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Your current password"
                error={ePwd.current_password?.message}
                {...rPwd('current_password')}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                error={ePwd.new_password?.message}
                {...rPwd('new_password')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                error={ePwd.confirm_password?.message}
                {...rPwd('confirm_password')}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={sPwd}>Update Password</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
