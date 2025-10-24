import type { Meta, StoryObj } from '@storybook/react'
import { OpeningCard } from './OpeningCard'
import { Text } from '../Text/Text'

const meta: Meta<typeof OpeningCard> = {
	title: 'UI/OpeningCard',
  	component: OpeningCard
} satisfies Meta<typeof OpeningCard>

export default meta
type Story = StoryObj<typeof OpeningCard>

export const OpeningCardDefault: Story = {
	args: {
		mainContent: <Text title="Заголовок"/>,
		additionalContent: <Text text="sue"/>
	}
}

export const OpeningCardWithoutAdditional: Story = {
	args: {
		mainContent: <Text title="Заголовок"/>
	}
}

export const OpeningCardOpenByDefault: Story = {
	args: {
		mainContent: <Text title="Заголовок"/>,
		additionalContent: <Text text="sue"/>,
		opened: true
	}
}
