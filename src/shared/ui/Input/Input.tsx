import type { InputHTMLAttributes } from 'react';
import cls from './Input.module.css';

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: Props) {
  return <input {...rest} className={[cls.input, className].filter(Boolean).join(' ')} />;
}
