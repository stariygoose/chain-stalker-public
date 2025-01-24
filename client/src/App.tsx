import { useEffect, useState, FC } from 'react'
import './App.css'
import { Header } from './components/Header'

const App: FC = () => {
	const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

	useEffect(() => {
		if (isDarkTheme) {
			document.documentElement.setAttribute('theme', 'dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.setAttribute('theme', 'light');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkTheme]);

  return (
    <>
      <Header 
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
      />
    </>
  )
}

export default App
