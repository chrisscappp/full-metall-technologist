import { classNames, Mods } from '@/utils/lib/classNames/classNames'
import { memo, MouseEvent, ReactNode, useCallback } from 'react'
import cls from './Card.module.scss'

interface CardProps {
    className?: string,
	hovered?: boolean,
	callback?: () => void,
    children: ReactNode;
}

export const Card = memo((props: CardProps) => {
	const { 
		className, 
		hovered,
		callback,
		children
	} = props

	const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		callback?.()
	}, [callback])

	const mods: Mods = {
		[cls.hovered]: hovered
	}

	return (
		<div className={classNames(cls.Card, mods, [className])} onClick={handleClick}>
			{children}
		</div>
	)
})
