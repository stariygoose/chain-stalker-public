import { RouterProvider } from "react-router-dom"
import { router } from "@/app/routing"

export const App = () => {
	return <RouterProvider router={router}/>
}