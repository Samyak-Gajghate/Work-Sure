// Global toast helper — wraps the ToastContext imperatively.
// Import `toast` and call toast.success(), toast.error(), etc.
// The actual implementation is in ToastContext. This is a convenience re-export.

type ToastFn = (message: string) => void;

interface ToastHelper {
  success: ToastFn;
  error: ToastFn;
  info: ToastFn;
  warning: ToastFn;
}

// Will be set by the ToastProvider on mount
let _toast: ToastHelper = {
  success: (m) => console.log('[toast:success]', m),
  error:   (m) => console.error('[toast:error]', m),
  info:    (m) => console.log('[toast:info]', m),
  warning: (m) => console.warn('[toast:warning]', m),
};

export function setToastImpl(impl: ToastHelper) {
  _toast = impl;
}

export const toast: ToastHelper = {
  success: (m) => _toast.success(m),
  error:   (m) => _toast.error(m),
  info:    (m) => _toast.info(m),
  warning: (m) => _toast.warning(m),
};
