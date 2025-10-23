import { classNames } from '@/utils/lib/classNames/classNames'
import { memo, useCallback } from 'react'
import { VStack } from '@/UI/Stack'
import { Button } from '@/UI/Button/Button'
import { truncateText } from '@/utils/lib/truncateText/truncateText'
import { TabPanelItem } from '../lib/types/tabPanel'
import cls from './TabPanel.module.scss'

interface TabPanelProps {
	className?: string,
	tabs?: object,
	withNumeric?: boolean
}

const maxTitleLength = 20

export const TabPanel = memo(({ className, tabs, withNumeric }: TabPanelProps) => {

	const onScrollToElement = useCallback((eId: string) => () => {
    	const element = document.getElementById(eId)
    	if (element) {
      		element.scrollIntoView({ behavior: 'smooth' })
    	}
  	}, [])

	if (!tabs) {
		return null
	}

	return (
		<VStack className={classNames(cls.TabPanel, {}, [className])} gap='4'>
			{Object.values(tabs).map((tab: TabPanelItem, index) => (
				<Button 
					key={`tab-${index}`}
					onClick={onScrollToElement(tab.id)}
					className={cls.tab}
					theme='clear'
					title={tab.title.length > maxTitleLength ? tab.title : ''}
				>
					{`${withNumeric ? `${index + 1}. ` : ''}${truncateText(tab.title, maxTitleLength)}`}
				</Button>
			))}
		</VStack>
	)
})
