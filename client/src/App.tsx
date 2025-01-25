import { FC } from 'react'

import './App.css'
import { Sidebar } from './components/sidebar/Sidebar'
import { Login } from './components/login/Login'

const App: FC = () => {
  return (
    <>
			<Sidebar />
			<Login />
    </>
  )
}

export default App
