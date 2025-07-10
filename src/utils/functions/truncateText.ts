export function truncateText(text: string, textLength = 30) {
	return text.length > textLength ? `${text.substring(0, textLength)}...` : text
}
