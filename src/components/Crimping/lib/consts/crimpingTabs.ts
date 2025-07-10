import { TabPanelItem } from '@/components/TabPanel'

const enum CrimpingTabsParams {
	MODEL = 'model',
	DIAMETER = 'diameter',
	MATERIAL = 'material',
	THICKNESS = 'thickness',
	STRENGTH = 'strength',
	ADDITIONAL_PARAMS = 'additionalParams',
	ANGLE = 'angle',
	ORGANIZATION_DATA = 'organizationData',
	RESULTS = 'results'
}

export const crimpingTabsConfig: Record<CrimpingTabsParams, TabPanelItem> = {
	model: {
		id: 'crimping-model',
		title: 'Работа с моделью'
	},
	organizationData: {
		id: 'crimping-organizationData',
		title: 'Данные организации'
	},
	material: {
		id: 'crimping-material',
		title: 'Материал'
	},
	diameter: {
		id: 'crimping-diameter',
		title: 'Диаметр'
	},
	thickness: {
		id: 'crimping-thickness',
		title: 'Толщина'
	},
	strength: {
		id: 'crimping-strength',
		title: 'Параметры материала'
	},
	additionalParams: {
		id: 'crimping-additionalParams',
		title: 'Доп. параметры'
	},
	angle: {
		id: 'crimping-angle',
		title: 'Углы конусности ската и корпуса'
	},
	results: {
		id: 'drowing-results',
		title: 'Результаты'
	}
}
