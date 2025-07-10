import ReactDOM from 'react-dom/client'
import App from './app/App'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { BrowserRouter } from 'react-router-dom'
import SidebarProvider from './utils/providers/SidebarProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<ThemeProvider>
			<SidebarProvider>
				<App />
			</SidebarProvider>
		</ThemeProvider>
	</BrowserRouter>
)
