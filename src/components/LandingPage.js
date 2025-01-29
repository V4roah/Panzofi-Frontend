import React, { useState, useEffect } from "react";
import { Button, Heading, Flex, Card, Text } from "@radix-ui/themes";

const LandingPage = () => {
  const [landingData, setLandingData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No hay token, inicia sesión nuevamente.");
        return;
      }

      try {
        const landingResponse = await fetch(
          "http://localhost:8000/api/landingpages/user_landing_page/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!landingResponse.ok) {
          throw new Error("Error al obtener la landing page");
        }

        const landingData = await landingResponse.json();
        setLandingData(landingData);

        const userResponse = await fetch(
          "http://localhost:8000/api/userprofiles/current_user/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Error al obtener el usuario");
        }

        const userData = await userResponse.json();
        setUserId(userData.user_id);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudo cargar la información.");
      }
    };

    fetchLandingData();
  }, []);

  const handleButtonClick = async (button) => {
    if (!userId) {
      console.error("Error: userId es null");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/userprofiles/${userId}/button_click/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ button }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al registrar el clic del botón");
      }

      console.log("Clic registrado en:", button);
    } catch (error) {
      console.error("Error al registrar el clic del botón", error);
    }
  };

  if (error)
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text>{error}</Text>
      </Flex>
    );

  if (!landingData)
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text>Cargando...</Text>
      </Flex>
    );

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#e5e7eb",
        }}
      >
        <Card
          style={{
            maxWidth: "500px",
            padding: "30px",
            textAlign: "center",
            borderRadius: "15px",
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
            backgroundColor: "white",
          }}
        >
          {landingData.logo ? (
            <img
              src={`http://localhost:8000${landingData.logo}`}
              alt="Logo"
              width="150"
              style={{ marginBottom: "20px" }}
            />
          ) : (
            <Text>No hay logo disponible</Text>
          )}

          <Heading size="4" style={{ marginBottom: "10px", color: "#374151" }}>
            {landingData.title || "Sin título"}
          </Heading>

          <Text style={{ marginBottom: "20px", color: "#6b7280" }}>
            {landingData.description || "Sin descripción"}
          </Text>

          <Flex gap="4" direction="column">
            <Button
              onClick={() => handleButtonClick("button1")}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "16px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Botón 1
            </Button>

            <Button
              onClick={() => handleButtonClick("button2")}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "16px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#059669")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#10b981")}
            >
              Botón 2
            </Button>

            <div style={{ marginTop: "30px" }}>
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
              >
                Cerrar sesión
              </Button>
            </div>
          </Flex>
        </Card>
      </div>
    </Flex>
  );
};

export default LandingPage;
