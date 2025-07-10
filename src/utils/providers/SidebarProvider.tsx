import { SidebarContext } from '../context/SidebarContext'
import { ReactNode, useMemo, useState } from 'react'

interface SidebarProviderProps {
	children: ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {

	const [sidebarContent, setSidebarContent] = useState<ReactNode>()
	const [isMountContent, setIsMountContent] = useState(false)

	const defaultProps = useMemo(() => ({
		sidebarContent,
		isMountContent,
		setSidebarContent,
		setIsMountContent
	}), [isMountContent, sidebarContent])

	return (
		<SidebarContext.Provider value={defaultProps}>
			{children}
		</SidebarContext.Provider>
	)
}

export default SidebarProvider
