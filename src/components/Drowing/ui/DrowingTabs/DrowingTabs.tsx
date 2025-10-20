import { TabPanel } from '@/components/TabPanel'
import { memo } from 'react'
import { drowingTabsConfig } from '../../lib/consts/drowing'
import { classNames } from '@/utils/lib/classNames/classNames'
import { VStack } from '@/UI/Stack'

interface DrowingTabsProps {
	className?: string
}

export const DrowingTabs = memo(({ className }: DrowingTabsProps) => {
	return (
		<VStack className={classNames('', {}, [className])} gap='20' max>
			<TabPanel tabs={drowingTabsConfig} withNumeric/>
		</VStack>
	)
})
