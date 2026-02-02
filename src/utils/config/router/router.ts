export enum AppRoutes {
	MAIN='main',

	// personal
	PERSONAL='personal',
	PESRONAL_COMPUTING='personal_computing',
	PERSONAL_HISTORY='personal_history',

	//last
	NOT_FOUND = 'not_found',
} 

export const getRouteMain = () => '/'
// Personal
export const getRoutePersonal = (id: string) => `/personal/${id}`
export const getPersonalComputingRoute = (id: string) => `/personal/computing/${id}`
export const getPersonalHistoryRoute = () => '/personal/history'
