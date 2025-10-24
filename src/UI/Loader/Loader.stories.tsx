import type { Meta, StoryObj } from '@storybook/react'
import { Loader } from './Loader'

const meta: Meta<typeof Loader> = {
	title: 'UI/Loader',
  	component: Loader
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof Loader>

export const LoaderSmall: Story = {
	args: {
		size: 'loader_s'
	}
}

export const LoaderMedium: Story = {
	args: {
		size: 'loader_m'
	}
}

export const LoaderLarge: Story = {
	args: {
		size: 'loader_l'
	}
}
