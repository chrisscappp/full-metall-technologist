import { ReactNode, useCallback, useContext } from 'react'
import { SidebarContext } from '../context/SidebarContext'

interface UseSidebarResult {
	sidebarContent: ReactNode,
	isMountContent: boolean,
	onMountContent: (content: ReactNode) => void,
	onUnmountContent: () => void
}

// Хук для вмонтирования в Sidebar определённого динамического контента
export function useSidebar(): UseSidebarResult {
	
	const { 
		isMountContent,
		sidebarContent,
		setIsMountContent, 
		setSidebarContent
	} = useContext(SidebarContext)

	const onMountContent = useCallback((content: ReactNode) => {
		setSidebarContent?.(content)
		setIsMountContent?.(true)
	}, [setIsMountContent, setSidebarContent])

	const onUnmountContent = useCallback(() => {
		setIsMountContent?.(false)
		setSidebarContent?.(undefined)
	}, [setIsMountContent, setSidebarContent])
	
	return {
		sidebarContent,
		isMountContent,
		onMountContent,
		onUnmountContent
	}
}
