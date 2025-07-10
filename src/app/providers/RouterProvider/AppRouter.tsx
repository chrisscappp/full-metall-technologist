import { routeConfig } from '@/utils/config/router/routerConfig'
import { Suspense, memo, useCallback } from 'react'
import { Route, Routes, RouteProps } from 'react-router-dom'

const AppRouter = () => {
	
	const renderWithWrapper = useCallback((route: RouteProps) => {
		return (
			<Route
				key={route.path}
				path={route.path}
				element={route.element}
			/>
		)
	}, [])

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				{Object.values(routeConfig).map(renderWithWrapper)}
			</Routes>
		</Suspense>
	)
}

export default memo(AppRouter)
