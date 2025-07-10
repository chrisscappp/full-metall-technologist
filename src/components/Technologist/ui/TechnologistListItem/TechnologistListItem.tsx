import { OpeningCard } from '@/UI/OpeningCard/OpeningCard'
import { memo, MouseEvent, useCallback } from 'react'
import { TechnologistItem } from '../../lib/types/technologistTypes'
import { HStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { Button } from '@/UI/Button/Button'
import cls from './TechnologistListItem.module.scss'
import { useNavigate } from 'react-router'
import { getTechnologistDetailRoute } from '@/utils/config/router/router'

interface TechnologistListItemProps {
	className?: string,
	item?: TechnologistItem
}

export const TechnologistListItem = memo((props: TechnologistListItemProps) => {
	
	const {
		className,
		item
	} = props

	const navigate = useNavigate()

	const onFollowToTechnology = useCallback((e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		navigate(getTechnologistDetailRoute(item?.id ?? ''))
	}, [item?.id, navigate])
	
	return (
		<OpeningCard
			className={className}
			mainContent={
				<HStack gap='20'>
					<Text title={item?.title} size='size_s'/>
					<Button onClick={onFollowToTechnology}>К расчету</Button>
				</HStack>
			}
			additionalContent={
				<HStack gap='16'>
					<Text textPre text={item?.description}/>
					{item?.img && <img src={item.img} alt="Пример" className={cls.img} />}
					
				</HStack>
			}
		/>
	)
})
