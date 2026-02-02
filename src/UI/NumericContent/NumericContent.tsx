import { memo, ReactNode } from 'react'
import { HStack } from '../Stack'
import { classNames } from '@/utils/lib/classNames/classNames'
import cls from './NumericContent.module.scss'

interface NumericContentProps {
	className?: string,
	number?: string,
	children: ReactNode
}

export const NumericContent = memo((props: NumericContentProps) => {
	
	const {
		className,
		number=0,
		children
	} = props
	
	return (
		<HStack className={classNames(cls.NumericContent, {}, [className])} gap="16" align="center">
			<div className={cls.numeric}>{number}</div>
			{children}
		</HStack>
	)
})
