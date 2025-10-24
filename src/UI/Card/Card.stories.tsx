import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Text } from '../Text/Text'

const meta: Meta<typeof Card> = {
	title: 'UI/Card',
  	component: Card
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof Card>

export const CardDefault: Story = {
	args: {
		children: <Text text="Text"/>
	}
}
