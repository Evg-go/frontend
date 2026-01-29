import type { PropsWithChildren } from 'react';
import cls from './Card.module.css';

export function Card({ children }: PropsWithChildren) {
  return <div className={cls.card}>{children}</div>;
}

export function CardTitle({ children }: PropsWithChildren) {
  return <h3 className={cls.title}>{children}</h3>;
}

export function Muted({ children }: PropsWithChildren) {
  return <div className={cls.muted}>{children}</div>;
}
