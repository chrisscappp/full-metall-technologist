//export type EstimatedValueType = [number, string]
// todo [BE_D][BE_W] Изменение возвращаемого результата расчетов

export interface ParseDrowingModelResultData<T> {
	error: string,
	modelParams: {
		material: string,
		mass: number,
		volume: number,
		filePath: string,
		fileName: string,
		density: number,
		variables: Record<keyof T, number>
	}
	kompasVersion: string,
	kompasApiVersion: string
}

export interface ParseDrowingModelResult<T> {
	message: string,
	status: number,
	data: ParseDrowingModelResultData<T>
}
