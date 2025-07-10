import { TabPanelItem } from '@/components/TabPanel'

const enum DrowingTabsParams {
	MODEL = 'model',
	GEOMETRY_PARAMS = 'geometryParams',
	ADDITIONAL_PARAMS = 'additionalParams',
	MAX_PULL = 'maxPull',
	MAX_THIN = 'maxThin',
	MATERIAL = 'material',
	ORGANIZATION_DATA = 'organizationData',
	RESULTS = 'results'
}

export const drowingTabsConfig: Record<DrowingTabsParams, TabPanelItem> = {
	model: {
		id: 'drowing-model',
		title: 'Работа с моделью'
	},
	organizationData: {
		id: 'crimping-organizationData',
		title: 'Данные организации'
	},
	material: {
		id: 'drowing-material',
		title: 'Материал'
	},
	geometryParams: {
		id: 'drowing-geometryParams',
		title: 'Геометрические параметры заготовки'
	},
	additionalParams: {
		id: 'drowing-additionalParams',
		title: 'Доп. параметры'
	},
	maxPull: {
		id: 'drowing-maxPull',
		title: 'Предельный коэффициент вытяжки'
	},
	maxThin: {
		id: 'drowing-maxThin',
		title: 'Предельный коэффициент утонения'
	},
	results: {
		id: 'drowing-results',
		title: 'Результаты'
	}
}
