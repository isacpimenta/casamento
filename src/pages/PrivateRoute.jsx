// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.js"; // caminho correto

export default function PrivateRoute({ children }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  if (!user) return <Navigate to="/" replace />; // rota do login ofuscada

  return children;
}
