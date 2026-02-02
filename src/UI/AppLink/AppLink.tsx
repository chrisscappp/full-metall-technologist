import { Link, LinkProps } from 'react-router-dom'
import cls from './AppLink.module.scss'
import { memo, ReactNode } from 'react'
import { classNames } from '@/utils/lib/classNames/classNames'

type AppLinkTheme = {
	primary: 'primary',
	secondary: 'secondary'
}

interface AppLinkProps extends LinkProps {
	className?: string,
	theme?: keyof AppLinkTheme,
	children?: ReactNode
}

export const AppLink = memo((props: AppLinkProps) => {

	const { 
		to, 
		className, 
		children, 
		theme='primary',
		...otherProps
	} = props

	return (
		<Link 
			to={to} 
			className={classNames(cls.AppLink, {}, [className, cls[theme]])}
			{...otherProps}
		>
			{children}
		</Link>
	)
})
