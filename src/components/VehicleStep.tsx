import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Alert,
  Row,
  Col,
  Typography,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FormData } from "../types";

const { Title, Text } = Typography;

interface Props {
  initialValues: FormData;
  onFinish: (values: any) => void;
}

const VehicleStep: React.FC<Props> = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [error, setError] = useState("");

  // ... (Keep your useEffect fetch logic the same as before) ...
  // Re-insert the fetch logic here (omitted for brevity, assume same logic)
  useEffect(() => {
    const fetchMakes = async () => {
      setLoadingMakes(true);
      try {
        const res = await fetch(
          "/.netlify/functions/get-vehicle-data?type=makes"
        );
        if (!res.ok) throw new Error();
        setMakes(await res.json());
      } catch (e) {
        setError("Failed to load vehicle list.");
      } finally {
        setLoadingMakes(false);
      }
    };
    fetchMakes();
  }, []);

  const handleMakeChange = async (value: string) => {
    form.setFieldsValue({ carModel: undefined });
    setModels([]);
    setLoadingModels(true);
    try {
      const res = await fetch(
        `/.netlify/functions/get-vehicle-data?type=models&make=${value}`
      );
      setModels(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingModels(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <Title level={3}>Tell us about your car</Title>
        <Text type="secondary">
          We need these details to find the best coverage for your specific
          vehicle.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        size="large" // Make inputs bigger and touch-friendly
      >
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="carYear" label="Year" rules={[{ required: true }]}>
              <InputNumber
                min={1980}
                max={new Date().getFullYear() + 1}
                style={{ width: "100%" }}
                placeholder="e.g. 2021"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="carMake" label="Make" rules={[{ required: true }]}>
              <Select
                showSearch
                loading={loadingMakes}
                onChange={handleMakeChange}
                options={makes.map((m) => ({ label: m, value: m }))}
                placeholder="Select Make"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="carModel"
              label="Model"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                loading={loadingModels}
                disabled={!models.length}
                options={models.map((m) => ({ label: m, value: m }))}
                placeholder="Select Model"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<ArrowRightOutlined />}
            disabled={loadingMakes || loadingModels}
            style={{ height: "50px", fontSize: "16px", fontWeight: 600 }}
          >
            Continue to Driver Info
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default VehicleStep;
