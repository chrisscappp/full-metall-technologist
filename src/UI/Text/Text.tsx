import { memo } from 'react'
import { classNames } from '@/utils/lib/classNames/classNames'
import cls from './Text.module.scss'

type TextTheme = {
	primary: 'primary',
	secondary: 'secondary',
	tertiary: 'tertiary',
	invertedPrimary: 'invertedPrimary',
	invertedSecondary: 'invertedSecondary',
	invertedTertiary: 'invertedTertiary',
	error: 'error'
}

type TextAlign = {
	right: 'right',
	center: 'center',
	left: 'left'
}

type TextSize = {
	size_sm: 'size_sm',
	size_s: 'size_s',
	size_m: 'size_m',
	size_l: 'size_l',
	size_xl: 'size_xl',
}

type TextWeight = {
	weight_normal: 'weight_normal',
	weight_bold: 'weight_bold'
}

interface TextProps {
	id?: string,
	className?: string,
	title?: string,
	text?: string,
	theme?: keyof TextTheme,
	align?: keyof TextAlign,
	size?: keyof TextSize,
	weight?: keyof TextWeight,
	textPre?: boolean,
	upperCase?: boolean
}

export const Text = memo((props: TextProps) => {

	const { 
		id,
		className,
		title,
		text,
		theme='primary',
		align='left',
		size='size_m',
		weight='normal',
		textPre=false,
		upperCase=false
	} = props

	const mods = {
		[cls[theme]]: true,
		[cls[align]]: align,
		[cls[size]]: true,
		[cls[weight]]: true,
		[cls.textPre]: textPre,
		[cls.upper]: upperCase
	}

	return (
		<div 
			className={classNames(cls.Text, mods, [className])}
			id={id}
		>
			{title && (
				<h1 className={cls.title}>
					{title}
				</h1>
			)}
			{text && (
				<p className={cls.text}>
					{text}
				</p>
			)}
		</div>
	)
})
