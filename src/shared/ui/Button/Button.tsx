import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cls from './Button.module.css';

type Button_variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Button_size = 'sm' | 'md' | 'lg';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: Button_variant;
  size?: Button_size;
  full_width?: boolean;
};

export function Button({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  full_width = false,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={join_classes(
        cls.button,
        cls[`variant_${variant}`],
        cls[`size_${size}`],
        full_width ? cls.full_width : '',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function join_classes(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}