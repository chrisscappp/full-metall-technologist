import { memo } from 'react'
import { SidebarBlock } from '../SidebarBlock/SidebarBlock'
import { getPersonalComputingRoute, getPersonalHistoryRoute, getRoutePersonal } from '@/utils/config/router/router'

export const SidebarPersonal = memo(() => {
	return (
		<>
			<SidebarBlock
				title="НАВИГАЦИЯ"
				items={[
					{ title: 'Главная', path: getRoutePersonal('1') },
					{ title: 'История', path: getPersonalHistoryRoute() }
				]}
			/>
			<SidebarBlock
				title="ОПЕРАЦИИ"
				items={[
					{ title: 'Вырубка', path: getPersonalComputingRoute('felling') },
					{ title: 'Вытяжка', path: getPersonalComputingRoute('drowing') },
					{ title: 'Обжим', path: getPersonalComputingRoute('crimping') },
				]} // Список операций, доступных пользователю. формировать в з-ти от авторизации
			/>
		</>
	)
})
