import { classNames } from '@/utils/functions/classNames'
import { memo } from 'react'
import './Loader.scss'

type LoaderSize = 'loader_s' | 'loader_m' | 'loader_l'
type LoaderTheme = 'loader_dark' | 'loader_white'

interface LoaderProps {
	className?: string,
	size?: LoaderSize,
	theme?: LoaderTheme
}

export const Loader = memo((props: LoaderProps) => {
	
	const {
		className,
		size = 'loader_m',
		theme = 'loader_white'
	} = props
	
	return (
		<span className={classNames('loader', {}, [className, size, theme])}></span>
	)
})
