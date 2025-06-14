
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "./Auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index.tsx mounted, redirecting to /auth");
    navigate("/auth", { replace: true });
  }, [navigate]);

  // Renderiza Auth diretamente caso o navigate não funcione por algum motivo
  return (
    <Auth />
  );
};

export default Index;
