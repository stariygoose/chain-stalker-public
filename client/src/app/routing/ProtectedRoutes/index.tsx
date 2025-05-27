import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes: FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		axios.get(`https://${import.meta.env.VITE_DOMAIN_URL}/api/v1/auth/check`, { withCredentials: true })
			.then(() => setIsAuthenticated(true))
			.catch((error) => {
				setIsAuthenticated(false);
				console.error(error);
			});
	}, []);

	if (isAuthenticated === null) return <div>Loading...</div>;
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}