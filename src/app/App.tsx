import './styles/index.scss'
import { classNames } from '@/utils/functions/classNames'
import { useTheme } from '@/utils/hooks/useTheme'
import { Sidebar } from '@/components/Sidebar'
import AppRouter from './providers/RouterProvider/AppRouter'

function App() {

	const { isLightTheme } = useTheme()

	return (
		<main className={classNames('app', {}, [isLightTheme ? 'app_light_theme' : 'app_dark_theme'])}>
			<Sidebar/>
			<AppRouter/>
		</main>
	)
}

export default App
