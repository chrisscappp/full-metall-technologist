import { memo, ReactNode } from 'react'
import cls from './Navbar.module.scss'
import { classNames } from '@/utils/functions/classNames'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Text } from '@/UI/Text/Text'
import { HStack } from '@/UI/Stack'

interface NavbarProps {
	className?: string,
	title?: string,
	content?: ReactNode
}

export const Navbar = memo(({ className, title, content }: NavbarProps) => {
	return (
		<HStack 
			className={classNames(cls.Navbar, {}, [className])} 
			max 
			gap='16'
			justify='between'
		>
			<HStack gap='16'>
				{content}
				<Text
					title={title}
					theme="secondary"
				/>
			</HStack>
			<ThemeSwitcher/>
		</HStack>
	)
})
