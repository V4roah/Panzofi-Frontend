import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Heading, Flex, Card } from "@radix-ui/themes";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });
      const token = response.data.access;
      setToken(token);
      localStorage.setItem("token", token);
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f5",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Card
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Heading size="4" style={{ marginBottom: "15px" }}>
            Iniciar Sesión
          </Heading>
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box mb="3" style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "calc(100% - 24px)",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  textAlign: "left",
                  display: "block",
                }}
              />
            </Box>
            <Box mb="3" style={{ width: "100%" }}>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "calc(100% - 24px)",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  textAlign: "left",
                  display: "block",
                }}
              />
            </Box>
            <Button
              type="submit"
              style={{
                width: "150px",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "16px",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                marginTop: "30px",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Iniciar Sesión
            </Button>
          </form>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </Card>
      </div>
    </Flex>
  );
};

export default Login;
