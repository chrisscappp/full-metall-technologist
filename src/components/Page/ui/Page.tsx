import { classNames } from '@/utils/functions/classNames'
import { memo, ReactNode } from 'react'
import cls from './Page.module.scss'

interface PageProps {
	className?: string,
	children: ReactNode
}

export const Page = memo(({ children, className }: PageProps) => {
	return (
		<article className={classNames(cls.Page, {}, [className])}>
			{children}
		</article>
	)
})
