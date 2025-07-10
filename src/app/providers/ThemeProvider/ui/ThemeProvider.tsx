import { LOCAL_STORAGE_THEME_KEY, Theme } from '@/utils/consts/themes'
import { ThemeContext } from '@/utils/context/ThemeContext'
import { ReactNode, useMemo, useState } from 'react'

const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) ?? Theme.LIGHT

interface ThemeProviderProps {
	initialTheme?: Theme,
	children: ReactNode
}

export const ThemeProvider = ({ children, initialTheme }: ThemeProviderProps) => {
	
	const [theme, setTheme] = useState(initialTheme || defaultTheme)

	const values = useMemo(() => ({
		theme,
		setTheme
	}), [theme])
	
	return (
		//@ts-ignore
		<ThemeContext.Provider value={values}>
			{children}
		</ThemeContext.Provider>
	)
}
