import type { Meta, StoryObj } from '@storybook/react'
import { ListBox } from './ListBox'

const meta: Meta<typeof ListBox> = {
	title: 'UI/ListBox',
  	component: ListBox
} satisfies Meta<typeof ListBox>

export default meta
type Story = StoryObj<typeof ListBox>

export const ListBoxDefault: Story = {
	args: {
		options: [
			{ content: 'Чиназес', value: 'china' },
			{ content: 'Суе', value: 'sue' },
			{ content: 'Немало', value: 'no more' },
		]
	}
}

export const ListBoxWithLabel: Story = {
	args: {
		label: 'Выберите значение',
		options: [
			{ content: 'Чиназес', value: 'china' },
			{ content: 'Суе', value: 'sue' },
			{ content: 'Немало', value: 'no more' },
		]
	}
}

export const ListBoxWithLabelAndActiveValue: Story = {
	args: {
		label: 'Выберите значение',
		options: [
			{ content: 'Чиназес', value: 'china' },
			{ content: 'Суе', value: 'sue' },
			{ content: 'Немало', value: 'no more' },
		],
		value: 'sue'
	}
}

export const ListBoxWithActiveValue: Story = {
	args: {
		label: 'Выберите значение',
		options: [
			{ content: 'Чиназес', value: 'china' },
			{ content: 'Суе', value: 'sue' },
			{ content: 'Немало', value: 'no more' },
		],
		value: 'sue'
	}
}

export const ListBoxReadonly: Story = {
	args: {
		options: [
			{ content: 'Чиназес', value: 'china' },
			{ content: 'Суе', value: 'sue' },
			{ content: 'Немало', value: 'no more' },
		],
		readonly: true
	}
}
