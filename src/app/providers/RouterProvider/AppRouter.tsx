import { PageLoader } from '@/components/PageLoader'
import { routeConfig } from '@/utils/config/router/routerConfig'
import { Suspense, memo, useCallback } from 'react'
import { Route, Routes, RouteProps } from 'react-router-dom'

const AppRouter = () => {
	
	const renderRoute = useCallback((route: RouteProps) => {
		return (
			<Route
				key={route.path}
				path={route.path}
				element={route.element}
			/>
		)
	}, [])

	return (
		<Suspense fallback={<PageLoader/>}>
			<Routes>
				{Object.values(routeConfig).map(renderRoute)}
			</Routes>
		</Suspense>
	)
}

export default memo(AppRouter)
