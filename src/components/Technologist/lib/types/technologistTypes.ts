export type TechnologistItemType = 'drowing' | 'felling' | 'crimping'

export interface TechnologistItem {
	id: string,
	title: string,
	description?: string,
	type: TechnologistItemType,
	img?: string
}
