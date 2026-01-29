import type { NavigateFunction } from 'react-router-dom';

let navigateFn: NavigateFunction | null = null;

export function setNavigate(navigate: NavigateFunction) {
  navigateFn = navigate;
}

export function navigateTo(to: string, opts?: { replace?: boolean; state?: unknown }) {
  if (navigateFn) {
    navigateFn(to, { replace: opts?.replace, state: opts?.state });
    return;
  }
  // fallback 
  window.location.assign(to);
}
