import type { ButtonHTMLAttributes } from 'react';
import cls from './Button.module.css';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'danger';
};

export function Button({ variant = 'default', className, ...rest }: Props) {
  const v = variant === 'primary' ? cls.primary : variant === 'danger' ? cls.danger : '';
  return <button {...rest} className={[cls.btn, v, className].filter(Boolean).join(' ')} />;
}
