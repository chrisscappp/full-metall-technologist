import ReactDOM from 'react-dom/client'
import App from './app/App'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</BrowserRouter>
)
