import { createContext } from 'react'
import { Theme } from '../consts/themes'

interface IThemeContext {
	theme?: Theme,
	setTheme?: (theme: Theme) => void
}

export const ThemeContext = createContext<IThemeContext>({})
