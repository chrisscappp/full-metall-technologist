import { classNames } from '@/utils/lib/classNames/classNames'
import cls from './ThemeSwitcher.module.scss'
import { memo } from 'react'
import { useTheme } from '@/utils/hooks/useTheme'
import SunIcon from '@/assets/icons/sun-64-64.svg'
import MoonIcon from '@/assets/icons/moon-64-64.svg'

interface ThemeSwitcherProps {
	className?: string
}

export const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {

	const { toggleTheme, isDarkTheme, isLightTheme } = useTheme()

	return (
		<div className={classNames(cls.ThemeSwitcher, {}, [className])}>
			<label className={cls.switch}>
				<input 
					type="checkbox" 
					onClick={toggleTheme}
				/>
				<span className={classNames(cls.slider, {[cls.bgSwithed]: isDarkTheme}, [])}>
					<div
						className={classNames(cls.ball, {[cls.isSwitched]: isDarkTheme}, [])}>
					</div>
				</span>
			</label>
			<img src={isLightTheme ? SunIcon : MoonIcon} className={cls.icon} />
		</div>
	)
})
