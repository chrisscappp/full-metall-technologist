import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { memo } from 'react'
import cls from './SidebarBlock.module.scss'
import { classNames } from '@/utils/lib/classNames/classNames'
import { AppLink } from '@/UI/AppLink/AppLink'
import { Button } from '@/UI/Button/Button'
import { useLocation } from 'react-router'

interface SidebarBlockItem {
	title?: string,
	path?: string,
	callback?: () => void
}

interface SidebarBlockProps {
	className?: string,
	title?: string,
	items?: SidebarBlockItem[]
}

export const SidebarBlock = memo((props: SidebarBlockProps) => {
	
	const {
		className,
		items,
		title
	} = props

	const location = useLocation()
	
	return (
		<VStack className={classNames(cls.nav, {}, [className])}>
			<Text
				className={cls.navTitle}
				text={title ?? ''}
				theme="tertiary"
				size="size_s"
			/>
			{items?.map((item, index) => {
				
				const isActive = location.pathname === item.path

				if (item.path) {
					return (
						<AppLink 
							key={item.title}
							className={classNames(cls.navItem, {[cls.last]: index === items.length - 1}, [isActive ? cls.active : ''])} 
							to={item.path}
						>
							<Text
								text={item.title}
								theme={isActive ? 'primary' : 'secondary'}
								weight='weight_normal'
								size="size_s"
							/>
						</AppLink>
					)
				}

				if (item.callback) {
					return (
						<Button 
							key={item.title}
							className={cls.navItem} 
							theme="clear"
							onClick={item.callback}
						>
							{item.title}
						</Button>
					)
				}
				
				return null
			})}
		</VStack>
	)
})
