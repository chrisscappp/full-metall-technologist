import { memo, type ReactNode } from 'react'
import { classNames, type Mods } from '../../../utils/lib/classNames/classNames'
import cls from './Flex.module.scss'

export type FlexHTMLTag = 'div' | 'article' | 'section'
export type FlexJustify = 'between' | 'around' | 'evenly' | 'start' | 'center' | 'end'
export type FlexAlign = 'start' | 'center' | 'end'
export type FlexDirection = 'row' | 'column'
export type FlexGap = '4' | '8' | '12' | '16' | '20' | '24' | '28' | '32' | '36' | '40' | '64'

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
	'16': cls.gap16,
	'20': cls.gap20,
	'24': cls.gap24,
	'28': cls.gap28,
	'32': cls.gap32,
	'36': cls.gap36,
	'40': cls.gap40,
	'64': cls.gap64
}

export interface FlexProps {
	className?: string,
	tag?: FlexHTMLTag,
	justify?: FlexJustify,
	align?: FlexAlign,
	gap?: FlexGap,
	direction?: FlexDirection,
	max?: boolean,
	flexWrap?: boolean,
	children: ReactNode
}

export const Flex = memo((props: FlexProps) => {
	
	const {
		className,
		tag='div',
		direction='row',
		align='start',
		justify='start',
		gap,
		max,
		flexWrap=false,
		children
	} = props

	const classes = [
		className,
		justifyClasses[justify],
		alignClasses[align],
		directionClasses[direction],
		gap && gapClasses[gap]
	]

	const mods: Mods = {
		[cls.max]: max,
		[cls.flexWrap]: flexWrap
	}

	return (
		<>
			{tag === 'div' && (
				<div className={classNames(cls.Flex, mods, classes)}>
					{children}
				</div>
			)}
			{tag === 'article' && (
				<article className={classNames(cls.Flex, mods, classes)}>
					{children}
				</article>
			)}
			{tag === 'section' && (
				<section className={classNames(cls.Flex, mods, classes)}>
					{children}
				</section>
			)}
		</>
	)
})
