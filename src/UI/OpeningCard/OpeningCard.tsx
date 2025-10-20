import { classNames } from '@/utils/lib/classNames/classNames'
import { memo, MouseEvent, ReactNode, useCallback, useState } from 'react'
import cls from './OpeningCard.module.scss'
import ArrowUpBlack from '@/assets/icons/arrow-up-black-64-64.svg'
import ArrowDownBlack from '@/assets/icons/arrow-down-black-64-64.svg'
import ArrowUpWhite from '@/assets/icons/arrow-up-white-64-64.svg'
import ArrowDownWhite from '@/assets/icons/arrow-down-white-64-64.svg'
import { useTheme } from '@/utils/hooks/useTheme'

interface OpeningCardProps {
    className?: string,
	opened?: boolean,
	mainContent: ReactNode,
	additionalContent?: ReactNode
}

export const OpeningCard = memo((props: OpeningCardProps) => {
	const { 
		className, 
		mainContent,
		additionalContent,
		opened
	} = props

	const [isOpened, setIsOpened] = useState(opened)
	const { isLightTheme } = useTheme()

	const onChangeIsOpened = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsOpened(!isOpened)
  	}, [isOpened])

	return (
		<div
			className={classNames(cls.OpeningCard, {}, [className])}
		>
			<details open={isOpened}>
				<summary className={cls.main} onClick={onChangeIsOpened}>
          			{mainContent}
        		</summary>
				{additionalContent && (
					<div className={cls.additional}>
						{additionalContent}
					</div>
				)}
			</details>
			<img 
				src={!isOpened && isLightTheme ? ArrowDownBlack : isOpened && isLightTheme ? ArrowUpBlack : !isOpened && !isLightTheme ? ArrowDownWhite : ArrowUpWhite} 
				className={cls.arrow}
				onClick={onChangeIsOpened}
			/>
		</div>
	)
})
