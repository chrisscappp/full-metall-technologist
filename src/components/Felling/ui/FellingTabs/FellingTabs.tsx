import { TabPanel } from '@/components/TabPanel'
import { memo } from 'react'
import { fellingTabsConfig } from '../../lib/consts/fellingTabs'
import { classNames } from '@/utils/lib/classNames/classNames'
import { VStack } from '@/UI/Stack'

interface FellingTabsProps {
	className?: string
}

export const FellingTabs = memo(({ className }: FellingTabsProps) => {
	return (
		<VStack className={classNames('', {}, [className])} gap='20' max>
			<TabPanel tabs={fellingTabsConfig} withNumeric/>
		</VStack>
	)
})
