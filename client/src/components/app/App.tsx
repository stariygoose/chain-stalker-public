import { FC } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../../pages/Layout'
import { Login } from '../login/Login'
import { LogoIcon } from '../icons/LogoIcon'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { ProtectedRoutes } from '../../routes/ProtectedRoutes'

const App: FC = () => {
  return (
    <BrowserRouter>
			<Routes>

				<Route element={<ProtectedRoutes/>}>
					<Route path="/" element={<Layout/>}>
						<Route path='test' element={<LogoIcon width={100} height={100}/>}/>
						<Route path='logo' element={<LogoIcon width={1000} height={1000}/>}/>
					</Route>
				</Route>

				<Route path="/" element={<Layout/>}>
					<Route path='login' element={<Login/>}/>
					<Route path='*' element={<NotFoundPage/>}/>
				</Route>
				
			</Routes>
    </BrowserRouter>
  )
}

export default App
