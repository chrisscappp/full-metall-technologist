import { classNames } from '@/utils/functions/classNames'
import { memo } from 'react'
import LogoLight from '@/assets/image/logo-light.png'
import LogoDark from '@/assets/image/logo-dark.png'
import { useTheme } from '@/utils/hooks/useTheme'
import { Text } from '@/UI/Text/Text'
import cls from './Sidebar.module.scss'
import { useSidebar } from '@/utils/hooks/useSidebar'

interface SidebarProps {
	className?: string
}

export const Sidebar = memo(({ className }: SidebarProps) => {

	const { isLightTheme } = useTheme()
	const { sidebarContent } = useSidebar()

	const additionalClasses = [
		className,
		sidebarContent ? cls.withContent : ''
	]

	return (
		<aside className={classNames(cls.Sidebar, {}, additionalClasses)}>
			<div className={cls.logoWrap}>
				<img src={isLightTheme ? LogoLight : LogoDark} className={cls.logo} />
				<Text 
					text="FULL METALL TECHONOLOGIST" 
					theme="secondary" 
					size="size_s" 
					align="center"
				/>
			</div>
			{sidebarContent && (
				<div className={cls.content}>
					{sidebarContent}
				</div>
			)}
		</aside>
	)
})
