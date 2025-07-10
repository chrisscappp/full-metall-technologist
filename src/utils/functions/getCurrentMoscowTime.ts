export const getCurrentMoscowTime = () => {
	const now = new Date()
	
	const mskOffset = 3 * 60 * 60 * 1000
	
	const mskTime = new Date(now.getTime() + mskOffset)

	const hours = mskTime.getUTCHours()
	const minutes = mskTime.getUTCMinutes()
	const seconds = mskTime.getUTCSeconds()
	
	const formattedHours = hours < 10 ? `0${hours}` : hours
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
