import { TabPanel } from '@/components/TabPanel'
import { memo } from 'react'
import { crimpingTabsConfig } from '../../lib/consts/crimpingTabs'
import { classNames } from '@/utils/functions/classNames'
import { VStack } from '@/UI/Stack'

interface CrimpingTabsProps {
	className?: string
}

export const CrimpingTabs = memo(({ className }: CrimpingTabsProps) => {
	return (
		<VStack className={classNames('', {}, [className])} gap='20' max>
			<TabPanel tabs={crimpingTabsConfig} withNumeric/>
		</VStack>
	)
})
