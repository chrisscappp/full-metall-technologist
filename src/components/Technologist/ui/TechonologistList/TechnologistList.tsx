import { HStack } from '@/UI/Stack'
import { memo, useMemo } from 'react'
import { technologistList } from '../../lib/consts/list'
import { TechnologistListItem } from '../TechnologistListItem/TechnologistListItem'

interface TechnologistListProps {
	className?: string
}

export const TechnologistList = memo(({ className }: TechnologistListProps) => {

	const list = useMemo(() => {
		return technologistList.map(item => (
			<TechnologistListItem
				key={item.id}
				item={item}
			/>
		))
	}, [])

	return (
		<HStack className={className} gap='20' max>
			{list}
		</HStack>
	)
})
