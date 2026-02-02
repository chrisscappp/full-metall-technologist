import './styles/index.scss'
import { classNames } from '@/utils/lib/classNames/classNames'
import { useTheme } from '@/utils/hooks/useTheme'
import { Sidebar } from '@/components/Sidebar'
import AppRouter from './providers/RouterProvider/AppRouter'
import { Navbar } from '@/components/Navbar'

// задать layout для роутов
function App() {

	const { isLightTheme } = useTheme()

	return (
		<div className={classNames('app', {}, [isLightTheme ? 'app_light_theme' : 'app_dark_theme'])}>
			<div className="page-wrapper">
				<Navbar/>
				<div className="content">
					<Sidebar/>
					<main className="main">
						<div className='page-content'>
							<AppRouter/>
						</div>
					</main>
				</div>
			</div>
		</div>
	)
}

export default App
