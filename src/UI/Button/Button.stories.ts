import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
	title: 'UI/Button',
  	component: Button
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const BackgroundDisabled: Story = {
	args: {
		children: 'Text',
		theme: 'background',
		disabled: true
	}
}

export const BackgroundSmall: Story = {
	args: {
		children: 'Text',
		theme: 'background',
		size: 'size_s'
	}
}

export const BackgroundMedium: Story = {
	args: {
		children: 'Text',
		theme: 'background',
		size: 'size_m'
	}
}

export const BackgroundLarge: Story = {
	args: {
		children: 'Text',
		theme: 'background',
		size: 'size_l'
	}
}

export const BackgroundXLarge: Story = {
	args: {
		children: 'Text',
		theme: 'background',
		size: 'size_xl'
	}
}

export const OutlineSmall: Story = {
	args: {
		children: 'Text',
		theme: 'outline',
		size: 'size_s'
	}
}

export const OutlineMedium: Story = {
	args: {
		children: 'Text',
		theme: 'outline',
		size: 'size_m'
	}
}

export const OutlineLarge: Story = {
	args: {
		children: 'Text',
		theme: 'outline',
		size: 'size_l'
	}
}

export const OutlineXLarge: Story = {
	args: {
		children: 'Text',
		theme: 'outline',
		size: 'size_xl'
	}
}

export const OutlineDisabled: Story = {
	args: {
		children: 'Text',
		theme: 'outline',
		disabled: true
	}
}

export const OutlineInvertedSmall: Story = {
	args: {
		children: 'Text',
		theme: 'outlineInverted',
		size: 'size_s'
	}
}

export const OutlineInvertedMedium: Story = {
	args: {
		children: 'Text',
		theme: 'outlineInverted',
		size: 'size_m'
	}
}

export const OutlineInvertedLarge: Story = {
	args: {
		children: 'Text',
		theme: 'outlineInverted',
		size: 'size_l'
	}
}

export const OutlineInvertedXLarge: Story = {
	args: {
		children: 'Text',
		theme: 'outlineInverted',
		size: 'size_xl'
	}
}

export const OutlineInvertedDisabled: Story = {
	args: {
		children: 'Text',
		theme: 'outlineInverted',
		disabled: true
	}
}

export const ClearSmall: Story = {
	args: {
		children: 'Text',
		theme: 'clear',
		size: 'size_s'
	}
}

export const ClearMedium: Story = {
	args: {
		children: 'Text',
		theme: 'clear',
		size: 'size_m'
	}
}

export const ClearLarge: Story = {
	args: {
		children: 'Text',
		theme: 'clear',
		size: 'size_l'
	}
}

export const ClearXLarge: Story = {
	args: {
		children: 'Text',
		theme: 'clear',
		size: 'size_xl'
	}
}

export const ClearDisabled: Story = {
	args: {
		children: 'Text',
		theme: 'clear',
		disabled: true
	}
}

export const ClearInvertedSmall: Story = {
	args: {
		children: 'Text',
		theme: 'clearInverted',
		size: 'size_s'
	}
}

export const ClearInvertedMedium: Story = {
	args: {
		children: 'Text',
		theme: 'clearInverted',
		size: 'size_m'
	}
}

export const ClearInvertedLarge: Story = {
	args: {
		children: 'Text',
		theme: 'clearInverted',
		size: 'size_l'
	}
}

export const ClearInvertedXLarge: Story = {
	args: {
		children: 'Text',
		theme: 'clearInverted',
		size: 'size_xl'
	}
}

export const ClearInvertedDisabled: Story = {
	args: {
		children: 'Text',
		theme: 'clearInverted',
		disabled: true
	}
}

export const ErrorSmall: Story = {
	args: {
		children: 'Text',
		theme: 'error',
		size: 'size_s'
	}
}

export const ErrorMedium: Story = {
	args: {
		children: 'Text',
		theme: 'error',
		size: 'size_m'
	}
}

export const ErrorLarge: Story = {
	args: {
		children: 'Text',
		theme: 'error',
		size: 'size_l'
	}
}

export const ErrorXLarge: Story = {
	args: {
		children: 'Text',
		theme: 'error',
		size: 'size_xl'
	}
}

export const ErrorDisabled: Story = {
	args: {
		children: 'Text',
		theme: 'error',
		disabled: true,
		hovered: false
	}
}
