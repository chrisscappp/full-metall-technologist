import { ReactNode } from 'react'
import { useDevice } from '../../hooks/useTauri/useTauri'

export const DesktopComponent = ({ children }: { children: ReactNode }) => {
	const { isDesktop } = useDevice()

	if (!isDesktop) {
		return null
	}

	return children
}
