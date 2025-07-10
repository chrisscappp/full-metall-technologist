export const isCorrectSize = (params: {finDiameter: number, initDiametr: number, finThickness: number, initThickness: number}) => {
	const { finDiameter, finThickness, initDiametr, initThickness } = params
	return (finDiameter <= initDiametr && finThickness <= initThickness) ? true : false
}
