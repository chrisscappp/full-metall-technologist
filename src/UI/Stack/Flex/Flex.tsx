import { CSSProperties, memo, ReactNode } from 'react'
import cls from './Flex.module.scss'
import { classNames, Mods } from '@/utils/lib/classNames/classNames'

export type FlexJustify = 'between' | 'around' | 'evenly' | 'start' | 'center' | 'end'
export type FlexAlign = 'start' | 'center' | 'end'
export type FlexDirection = 'row' | 'column'
export type FlexGap = '4' | '8' | '12' | '16' | '20' | '32' | '64'

const justifyClasses: Record<FlexJustify, string> = {
	between: cls.justifyBetween,
	around: cls.justifyAround,
	evenly: cls.justifyEvenly,
	start: cls.justifyStart,
	center: cls.justifyCenter,
	end: cls.justifyEnd
}

const alignClasses: Record<FlexAlign, string> = {
	start: cls.alignStart,
	center: cls.alignCenter,
	end: cls.alignEnd
}

const directionClasses: Record<FlexDirection, string> = {
	row: cls.directionRow,
	column: cls.directionColumn
}

const gapClasses: Record<FlexGap, string> = {
	'4': cls.gap4,
	'8': cls.gap8,
	'12': cls.gap12,
	'20': cls.gap20,
	'16': cls.gap16,
	'32': cls.gap32,
	'64': cls.gap64
}

export interface FlexProps {
	className?: string,
	children: ReactNode,
	justify?: FlexJustify,
	align?: FlexAlign,
	gap?: FlexGap
	direction: FlexDirection,
	max?: boolean,
	style?: CSSProperties
}

export const Flex = memo((props: FlexProps) => {
	
	const {
		className,
		children,
		direction='row',
		align='center',
		justify='start',
		gap,
		max,
		style
	} = props

	const classes = [
		className,
		justifyClasses[justify],
		alignClasses[align],
		directionClasses[direction],
		gap && gapClasses[gap]
	]

	const mods: Mods = {
		[cls.max]: max
	}

	return (
		<div 
			className={classNames(cls.Flex, mods, classes)}
			style={style}
		>
			{children}
		</div>
	)
})
