import { MainPage } from '@/pages/MainPage'
import { AppRoutes, getTechnologistDetailRoute, getRouteMain } from './router'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteProps } from 'react-router-dom'
import { TechnologistDetailPage } from '@/pages/TechnologistDetailPage'

export const routeConfig: Record<AppRoutes, RouteProps> = {
	[AppRoutes.MAIN]: {
		path: getRouteMain(),
		element: <MainPage/>
	},
	[AppRoutes.TECHNOLOGIST_DETAIL]: {
		path: getTechnologistDetailRoute(':id'),
		element: <TechnologistDetailPage/>
	},
	//last
	[AppRoutes.NOT_FOUND]: {
		path: '*',
		element: <NotFoundPage/>
	}
}
