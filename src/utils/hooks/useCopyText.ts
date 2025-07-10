import { useCallback, useState } from 'react'

interface UseCopyTextResult {
	copiedText: string,
	onCopyText: (text: string) => void
}

export function useCopyText(): UseCopyTextResult {
	const [copiedText, setCopiedText] = useState('')

	const onCopyText = useCallback((text: string) => {
		navigator.clipboard.writeText(text)
		setCopiedText(text)
	}, [])

	return {
		copiedText,
		onCopyText
	}
}
