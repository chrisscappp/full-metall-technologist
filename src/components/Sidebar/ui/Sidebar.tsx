import { classNames } from '@/utils/lib/classNames/classNames'
import { memo } from 'react'
import cls from './Sidebar.module.scss'
import { SidebarPersonal } from './SidebarPersonal/SidebarPersonal'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

interface SidebarProps {
	className?: string
}

export const Sidebar = memo(({ className }: SidebarProps) => {
	return (
		<aside className={classNames(cls.Sidebar, {}, [className])}>
			<SidebarPersonal/>
			<ThemeSwitcher className={cls.themeSwitcher}/>
		</aside>
	)
})
