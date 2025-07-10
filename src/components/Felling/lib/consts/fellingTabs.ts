import { TabPanelItem } from '@/components/TabPanel'

const enum FellingTabsParams {
	INITIAL_PARAMS = 'initialParams',
	PERMISSIBLE = 'permissible',
	MATRIX_PARAMS = 'matrixParams',
	ADDITIONAL_PARAMS = 'additionalParams',
	RESULTS = 'results',
	MATERIAL = 'material',
	ORGANIZATION_DATA = 'organizationData'
}

export const fellingTabsConfig: Record<FellingTabsParams, TabPanelItem> = {
	organizationData: {
		id: 'crimping-organizationData',
		title: 'Данные организации'
	},
	initialParams: {
		id: 'felling-initialParams',
		title: 'Исходные данные'
	},
	permissible: {
		id: 'felling-permissible',
		title: 'Допускаемое напряжение на инструменте'
	},
	matrixParams: {
		id: 'felling-matrixParams',
		title: 'Параметры матрицы'
	},
	additionalParams: {
		id: 'felling-additionalParams',
		title: 'Доп. параметры'
	},
	material: {
		id: 'felling-material',
		title: 'Материал'
	},
	results: {
		id: 'drowing-results',
		title: 'Результаты'
	}
}
