import { ReactNode } from 'react'
import { isTauri } from '@tauri-apps/api/core'

export const DesktopComponent = ({ children }: { children: ReactNode }) => {
	if (!isTauri()) {
		return null
	}

	return children
}
