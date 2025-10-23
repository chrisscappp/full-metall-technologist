// Квалитет 6 - для выборки допускаемых значений при расчетах (диаметр, толщина и т.д.)
export const kvalitet6 = (value: number) => {
	if (value <= 3) return -0.006
	if (value > 3 && value <= 6) return -0.008
	if (value > 6 && value <= 10) return -0.009
	if (value > 10 && value <= 18) return -0.011
	if (value > 18 && value <= 30) return -0.013
	if (value > 30 && value <= 50) return -0.016
	if (value > 50 && value <= 80) return -0.016
	if (value > 80 && value <= 120) return -0.022
	if (value > 120 && value <= 180) return -0.025
	if (value > 180 && value <= 250) return -0.029
	if (value > 250 && value <= 315) return -0.032
	if (value > 315 && value <= 400) return -0.036
	if (value > 400 && value <= 500) return -0.04
	return -0.04 
}

// export const kvalitet11 = (value: number) => {
// 	return -0.33
// } // дополнить по значениям
