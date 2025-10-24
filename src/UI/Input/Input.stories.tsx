import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
	title: 'UI/Input',
  	component: Input
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof Input>

export const InputDefault: Story = {
	args: {
		placeholder: 'Введите текст'
	}
}

export const InputReadonly: Story = {
	args: {
		placeholder: 'Введите текст',
		readonly: true
	}
}

export const InputReadonlyWithValue: Story = {
	args: {
		value: 'суе',
		readonly: true
	}
}

export const InputWithValue: Story = {
	args: {
		value: 'гуф жыв'
	}
}

export const InputWithLabel: Story = {
	args: {
		value: 'суе',
		label: 'Какой-то лейбл газгольдер'
	}
}

export const InputWithError: Story = {
	args: {
		value: 'суе',
		error: 'Ошибка ввода'
	}
}

export const InputWithLabelAndError: Story = {
	args: {
		value: 'суе',
		label: 'Какой-то лейбл газгольдер',
		error: 'Ошибка ввода'
	}
}
