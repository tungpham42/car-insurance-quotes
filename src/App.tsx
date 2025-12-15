import React, { useState } from "react";
import { Layout, Steps, ConfigProvider } from "antd";
import {
  CarFilled,
  UserOutlined,
  SafetyCertificateFilled,
} from "@ant-design/icons";
import VehicleStep from "./components/VehicleStep";
import DriverStep from "./components/DriverStep";
import QuoteResults from "./components/QuoteResults";
import { FormData } from "./types";
import "./App.css";

const { Content } = Layout;

const theme = {
  token: {
    colorPrimary: "#4f46e5",
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
};

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<FormData>({});

  const next = (val: Partial<FormData>) => {
    setFormData((p) => ({ ...p, ...val }));
    setCurrent((c) => c + 1);
  };
  const back = () => setCurrent((c) => c - 1);
  const reset = () => {
    setFormData({});
    setCurrent(0);
  };

  const steps = [
    {
      title: "Vehicle",
      icon: <CarFilled />,
      description: "Car Details",
      content: <VehicleStep initialValues={formData} onFinish={next} />,
    },
    {
      title: "Driver",
      icon: <UserOutlined />,
      description: "Your Profile",
      content: (
        <DriverStep initialValues={formData} onFinish={next} onBack={back} />
      ),
    },
    {
      title: "Quotes",
      icon: <SafetyCertificateFilled />,
      description: "Your Rates",
      content: <QuoteResults data={formData} onReset={reset} />,
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Header Section */}
          <div className="custom-header">
            <h1 style={{ fontSize: "2.5rem" }}>
              Soft<span style={{ color: "#4f46e5" }}>Sure</span>
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
              Smart car insurance quotes powered by{" "}
              <a href="https://soft.io.vn" target="_blank" rel="noreferrer">
                SOFT.io.vn
              </a>
            </p>
          </div>

          {/* Main Card */}
          <div
            className="glass-card"
            style={{ maxWidth: 900, width: "100%", padding: "40px" }}
          >
            <Steps
              current={current}
              items={steps.map((s) => ({
                title: s.title,
                icon: s.icon,
                description: s.description,
              }))}
              style={{ marginBottom: 40 }}
            />

            <div className="step-content-enter">{steps[current].content}</div>
          </div>

          <p
            style={{
              marginTop: "2rem",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            © {new Date().getFullYear()} SoftSure (soft.io.vn). All rights
            reserved.
          </p>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
export default App;
