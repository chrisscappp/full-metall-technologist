import { Page } from '@/components/Page'
import { memo } from 'react'
import { Text } from '@/UI/Text/Text'

export const NotFoundPage = memo(() => {
	return (
		<Page>
			<Text
				title="Не удалось найти раздел"
				weight="weight_bold"
				size="size_l"
			/>
		</Page>
	)
})
