import { MainPage } from '@/pages/MainPage'
import { AppRoutes, getRouteMain, getRoutePersonal, getPersonalComputingRoute, getPersonalHistoryRoute } from './router'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteProps } from 'react-router-dom'
import { PersonalComputingPage } from '@/pages/PersonalComputingPage'
import { PersonalPage } from '@/pages/PersonalPage'
import { ReactNode } from 'react'
import { PersonalHistoryPage } from '@/pages/PersonalHistoryPage'

type RoutePropsType = RouteProps & {
	authOnly?: boolean,
	layout?: ReactNode
}

export const routeConfig: Record<AppRoutes, RoutePropsType> = {
	[AppRoutes.MAIN]: {
		path: getRouteMain(),
		element: <MainPage/>,
	},
	// Personal
	[AppRoutes.PERSONAL]: {
		path: getRoutePersonal(':id'),
		element: <PersonalPage/>
	},
	[AppRoutes.PESRONAL_COMPUTING]: {
		path: getPersonalComputingRoute(':id'),
		element: <PersonalComputingPage/>
	},
	[AppRoutes.PERSONAL_HISTORY]: {
		path: getPersonalHistoryRoute(),
		element: <PersonalHistoryPage/>
	},
	//last
	[AppRoutes.NOT_FOUND]: {
		path: '*',
		element: <NotFoundPage/>
	}
}
