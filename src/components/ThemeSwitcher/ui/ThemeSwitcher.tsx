import { Mods, classNames } from '@/utils/functions/classNames'
import cls from './ThemeSwitcher.module.scss'
import { CSSProperties, memo, MutableRefObject, useEffect, useRef, useState } from 'react'
import { useTheme } from '@/utils/hooks/useTheme'
import SunIcon from '@/assets/icons/sun-64-64.svg'
import MoonIcon from '@/assets/icons/moon-64-64.svg'

interface ThemeSwitcherProps {
	className?: string
}

export const ThemeSwitcher = memo((props: ThemeSwitcherProps) => {

	const { className } = props

	const { toggleTheme, isDarkTheme, isLightTheme } = useTheme()
	const [ isSwitched, setIsSwitched ] = useState(false)

	const ref = useRef() as MutableRefObject<CSSProperties>

	useEffect(() => {
		if (isDarkTheme) {
			setIsSwitched(true)
		}
	}, [isDarkTheme])

	const onSwitch = () => {
		toggleTheme()
		setIsSwitched(!isSwitched)
	}

	const mods: Mods = {
		[cls.dark]: isDarkTheme,
		[cls.round]: true,
		[cls.bgSwithed]: isSwitched
	}

	return (
		<div className = {classNames(cls.ThemeSwitcher, {}, [className])}>
			<label className={cls.switch}>
				<input 
					type="checkbox" 
					onClick = {onSwitch}
				/>
				<span 
					className={classNames(cls.slider, mods, [])}
				>
					<div
						//@ts-ignore
						ref={ref}
						className={classNames(cls.ball, {[cls.isSwitched]: isSwitched}, [])}>
					</div>
				</span>
			</label>
			{isLightTheme ? (
				<img src={SunIcon} className={cls.icon} />
			) : (
				<img src={MoonIcon} className={cls.icon} />
			)}
		</div>
	)
})
