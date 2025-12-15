import React from "react";
import {
  Form,
  InputNumber,
  Radio,
  Button,
  Space,
  Checkbox,
  Card,
  Typography,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, ThunderboltFilled } from "@ant-design/icons";
import { FormData } from "../types";

const { Title, Text } = Typography;

interface Props {
  initialValues: FormData;
  onFinish: (values: any) => void;
  onBack: () => void;
}

const DriverStep: React.FC<Props> = ({ initialValues, onFinish, onBack }) => {
  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: "10px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <Title level={3}>About the Driver</Title>
        <Text type="secondary">
          Help insurers understand your driving profile.
        </Text>
      </div>

      <Form
        layout="vertical"
        initialValues={{
          ...initialValues,
          incidents: initialValues.incidents || [],
        }}
        onFinish={onFinish}
        size="large"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="driverAge"
              label="Age"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={16}
                max={100}
                style={{ width: "100%" }}
                placeholder="e.g. 28"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Radio.Button value="male" style={{ width: "50%" }}>
                  Male
                </Radio.Button>
                <Radio.Button value="female" style={{ width: "50%" }}>
                  Female
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Card
          bordered={false}
          style={{ background: "#f9fafb", marginBottom: 30, borderRadius: 12 }}
        >
          <Title level={5} style={{ marginTop: 0 }}>
            <ThunderboltFilled style={{ color: "#f59e0b", marginRight: 8 }} />
            Incident History (Last 5 Years)
          </Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Select all that apply. Honesty ensures your quote is accurate.
          </Text>

          <Form.Item name="incidents" valuePropName="checked" noStyle>
            <Checkbox.Group style={{ width: "100%" }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Checkbox value="speeding_minor">
                    Speeding (&lt;15mph)
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="speeding_major">
                    Speeding (&gt;15mph)
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="accident_fault">At-Fault Accident</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="accident_no_fault">
                    Not-At-Fault Accident
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="dui">DUI / DWI</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="suspended">License Suspension</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Card>

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button onClick={onBack} size="large" icon={<ArrowLeftOutlined />}>
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ minWidth: 150, height: "50px", fontWeight: 600 }}
          >
            Get My Quotes
          </Button>
        </Space>
      </Form>
    </div>
  );
};
export default DriverStep;
