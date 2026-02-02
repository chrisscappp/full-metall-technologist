import { classNames, Mods } from '@/utils/lib/classNames/classNames'
import { ButtonHTMLAttributes, ReactNode, memo } from 'react'
import cls from './Button.module.scss'

type ButtonTheme = {
	clear: 'clear',
	clearInverted: 'clearInverted',
	error: 'error',
	outline: 'outline',
	background: 'background',
	outlineInverted: 'outlineInverted',
	backgroundInverted: 'backgroundInverted',
	tertiary: 'tertiary'
}

type ButtonSize = {
	size_s: 'size_s',
	size_m: 'size_m',
	size_l: 'size_l',
	size_xl: 'size_xl'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	theme?: keyof ButtonTheme;
	size?: keyof ButtonSize;
	disabled?: boolean;
	hoveredTheme?: keyof ButtonTheme;
	hovered?: boolean;
	children?: ReactNode;
}

export const Button = memo((props: ButtonProps) => {

	const { 
		className, 
		theme='background',
		children,
		disabled,
		hovered,
		size='size_m',
		...otherProps
	} = props

	const mods: Mods = {
		[cls[theme]]: true,
		[cls[size]]: true,
		[cls.disabled]: disabled,
		[cls.hovered]: hovered
	}

	return (
		<button 
			className={classNames(cls.Button, mods, [className])}
			disabled={disabled}
			{...otherProps}
		>
			{children}
		</button>
	)
})
