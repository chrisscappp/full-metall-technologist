import { memo, useCallback } from 'react'
import { TechnologistItem } from '../../lib/types/technologistTypes'
import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { Button } from '@/UI/Button/Button'
import cls from './TechnologistListItem.module.scss'
import { useNavigate } from 'react-router'
import { getPersonalComputingRoute } from '@/utils/config/router/router'
import { Card } from '@/UI/Card/Card'
import { classNames } from '@/utils/lib/classNames/classNames'

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

	const onFollowToComputing = useCallback(() => {
		navigate(getPersonalComputingRoute(item?.type ?? ''))
	}, [item?.type, navigate])
	
	return (
		<Card className={classNames(cls.TechnologistCard, {}, [className])} hovered callback={onFollowToComputing}>
			<VStack max gap="20">
				<VStack max gap="4">
					<Text title={item?.title} size='size_s'/>
					<Text text={item?.subTitle} size='size_sm' theme="tertiary" upperCase/>
				</VStack>
				<Text text={item?.description} size='size_s' theme="secondary"/>
				<Button className={cls.btn}>
					К расчету
				</Button>
			</VStack>
		</Card>
	)
})
