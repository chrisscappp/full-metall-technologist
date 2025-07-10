import { createContext, ReactNode } from 'react'

export interface ISidebarContext {
  	sidebarContent: ReactNode,
	isMountContent: boolean,
 	setSidebarContent?: (content: ReactNode | undefined) => void
  	setIsMountContent?: (value: boolean) => void
}

export const SidebarContext = createContext<ISidebarContext>({
	sidebarContent: undefined,
	isMountContent: false
})
