import { classNames } from '@/utils/lib/classNames/classNames'
import { memo, ReactNode } from 'react'
import cls from './Card.module.scss'

interface CardProps {
    className?: string;
    children: ReactNode;
}

export const Card = memo((props: CardProps) => {
	const { 
		className, 
		children
	} = props

	return (
		<div
			className={classNames(cls.Card, {}, [className])}
		>
			{children}
		</div>
	)
})
