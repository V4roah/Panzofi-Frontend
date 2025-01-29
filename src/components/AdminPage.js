import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Text,
  Heading,
  Flex,
  Box,
  Card,
} from "@radix-ui/themes";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminPage = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8000/api/userprofiles/analytics/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text>Cargando datos...</Text>
      </Flex>
    );

  if (error)
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text color="red">{error}</Text>
      </Flex>
    );

  const barChartData = {
    labels: analytics.map((user) => user.username),
    datasets: [
      {
        label: "Clics en Botón 1",
        data: analytics.map((user) => user.button1_clicks),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Clics en Botón 2",
        data: analytics.map((user) => user.button2_clicks),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "20px",
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
            width: "95%",
            maxWidth: "1200px",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
          }}
        >
          <Flex justify="between" align="center" mb="4">
            <Heading size="4">Panel de Administración</Heading>
            <Button
              variant="solid"
              color="red"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              style={{
                padding: "10px 15px",
                fontSize: "14px",
                borderRadius: "6px",
              }}
            >
              Cerrar sesión
            </Button>
          </Flex>

          {/* 📌 Nueva distribución: Tabla a la izquierda, Gráficas a la derecha */}
          <Flex
            gap="20px"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {/* 📋 Tabla de datos */}
            <Box style={{ flex: "1", overflowX: "auto" }}>
              <Table.Root style={{ width: "100%", borderRadius: "8px" }}>
                <Table.Header>
                  <Table.Row
                    style={{ backgroundColor: "#e5e7eb", fontWeight: "bold" }}
                  >
                    <Table.ColumnHeaderCell>Usuario</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Inicio de sesión
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Cierre de sesión
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Duración</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Clics Botón 1
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Clics Botón 2
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {analytics.map((user, index) => (
                    <Table.Row
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f3f4f6" : "white",
                      }}
                    >
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.login_time || "N/A"}</Table.Cell>
                      <Table.Cell>{user.logout_time || "N/A"}</Table.Cell>
                      <Table.Cell>{user.session_duration || "N/A"}</Table.Cell>
                      <Table.Cell>{user.button1_clicks}</Table.Cell>
                      <Table.Cell>{user.button2_clicks}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* 📊 Contenedor de gráficas */}
            <Box
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* 📊 Gráfica de Barras */}
              <Box
                style={{
                  padding: "10px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Heading
                  size="3"
                  style={{ textAlign: "center", marginBottom: "10px" }}
                >
                  Clics en los Botones
                </Heading>
                <Bar data={barChartData} />
              </Box>
            </Box>
          </Flex>
        </Card>
      </div>
    </Flex>
  );
};

export default AdminPage;
