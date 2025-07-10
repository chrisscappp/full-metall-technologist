export const getCurrentDate = () => {
	const now = new Date()

  	const day = now.getDate()
  	const month = now.getMonth() + 1
  	const year = now.getFullYear()
  
  	const formattedDay = day < 10 ? `0${day}` : day
  	const formattedMonth = month < 10 ? `0${month}` : month
  
  	return `${formattedDay}.${formattedMonth}.${year}`
}
