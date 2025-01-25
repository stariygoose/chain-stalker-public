import { createRoot } from 'react-dom/client'

import './components/theme-provider/themes.css'
import './index.css'

import App from './App.tsx'
import { Theme } from './components/theme-provider/Theme.tsx'

createRoot(document.getElementById('root')!).render(
	<Theme>
    	<App />
	</Theme>
)
