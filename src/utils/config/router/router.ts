export enum AppRoutes {
	MAIN = 'main',
	TECHNOLOGIST_DETAIL = 'technologist_detail',
	//last
	NOT_FOUND = 'not_found',
} 

export const getRouteMain = () => '/'
export const getTechnologistDetailRoute = (id: string) => `/technologist/${id}`
