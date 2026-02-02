import { useEffect, useState } from 'react'
import { isTauri } from '@tauri-apps/api/core'

export function useDevice() {
	const [isDesktop, setIsDesktop] = useState(false)

  	useEffect(() => {
    	const checkDesktop = () => {
      		const isDesktop = isTauri()
			setIsDesktop(!!isDesktop)
    	}

    	checkDesktop()
  	}, [])

  	return { isDesktop }
}
