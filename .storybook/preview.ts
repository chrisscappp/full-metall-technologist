import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { StylesDecorator } from '../src/utils/config/storybook/StylesDecorator/StylesDecorator'
import { RouterDecorator } from '../src/utils/config/storybook/RouterDecorator/RouterDecorator'
import { Renderer } from 'storybook/internal/csf'
import '../src/app/styles/index.scss'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    themes: [
      { name: 'light', class: ['app_light_theme'], color: '#ffffff' },
      { name: 'dark', class: ['app_dark_theme'], color: '#000000' }
    ]
  },
  decorators: [
    StylesDecorator,
    RouterDecorator,
    withThemeByClassName<Renderer>({
      themes: {
        light: 'app_light_theme',
        dark: 'app_dark_theme'
      },
      defaultTheme: 'light'
    })
  ]
}

export default preview
