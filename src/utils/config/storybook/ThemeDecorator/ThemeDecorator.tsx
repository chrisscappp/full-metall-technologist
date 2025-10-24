import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { Theme } from '../../../consts/themes'
import { Decorator, StoryFn } from '@storybook/react'

export const ThemeDecorator = (theme: Theme): Decorator => (StoryComponent: StoryFn)  => {
	return (
		<ThemeProvider initialTheme={theme}>
			<div className = {`app ${theme === Theme.LIGHT ? 'app_light_theme' : 'app_dark_theme'}`}>
				<StoryComponent/>
			</div>
		</ThemeProvider>
	)
}
