import { useDevice } from '@/utils/hooks/useTauri/useTauri'
import { ReactNode } from 'react'

export const DesktopComponent = ({ children }: { children: ReactNode }) => {
	const { isDesktop } = useDevice()

	if (isDesktop) {
		return children
	} else {
		return null
	}
}
