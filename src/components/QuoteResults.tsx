import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  List,
  Tag,
  Typography,
  Spin,
  Alert,
  Rate,
  Badge,
  Modal,
  Result,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { FormData, Quote } from "../types";

const { Title, Text } = Typography;

const QuoteResults: React.FC<{ data: FormData; onReset: () => void }> = ({
  data,
  onReset,
}) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch("/.netlify/functions/get-quotes", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(setQuotes)
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, [data]);

  const handleSelectPlan = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  // Helper to open the link
  const handleGoToSite = () => {
    if (selectedQuote?.url) {
      window.open(selectedQuote.url, "_blank"); // Opens in new tab
      setIsModalOpen(false); // Optionally close modal
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 20, color: "#4f46e5" }}>
          Scanning Provider Networks...
        </Title>
        <Text>
          Checking rates with Geico, Progressive, State Farm, and more.
        </Text>
      </div>
    );

  if (quotes.length === 0)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Alert
          message="High Risk Profile"
          description="We could not find online quotes for this profile. Please call 1-800-INSURE-ME."
          type="error"
          showIcon
        />
        <Button onClick={onReset} style={{ marginTop: 20 }}>
          Modify Search
        </Button>
      </div>
    );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Title level={2}>Your Top Matches</Title>
        <Text type="secondary">
          We found {quotes.length} policies starting at ${quotes[0].price}/mo.
        </Text>
      </div>

      <List
        grid={{ gutter: 24, column: 1 }}
        dataSource={quotes}
        renderItem={(item, index) => (
          <List.Item>
            <Badge.Ribbon
              text={index === 0 ? "Cheapest" : "Best Value"}
              color={index === 0 ? "#10b981" : "transparent"}
              style={{
                display: index > 1 ? "none" : "block",
                color: index === 1 ? "#000" : "#fff",
              }}
            >
              <Card hoverable style={{ borderRadius: 12, overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: 200,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        backgroundImage: `url(${item.logo})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        marginRight: 16,
                      }}
                    />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        {item.provider}
                      </Title>
                      <Rate
                        disabled
                        defaultValue={item.rating}
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>

                  <div style={{ minWidth: 200, flex: 2 }}>
                    <Tag color="blue" style={{ marginBottom: 8 }}>
                      {item.coverageType}
                    </Tag>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <strong>Limits:</strong> {item.limits} (BI/PD/UM)
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {item.perks.map((perk) => (
                        <Tag
                          key={perk}
                          icon={<CheckCircleOutlined />}
                          bordered={false}
                        >
                          {perk}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 150 }}>
                    <Title level={2} style={{ color: "#4f46e5", margin: 0 }}>
                      ${item.price}
                    </Title>
                    <Text type="secondary">per month</Text>
                    <Button
                      type="primary"
                      size="large"
                      block
                      style={{ marginTop: 10, borderRadius: 6 }}
                      onClick={() => handleSelectPlan(item)}
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Button type="text" onClick={onReset}>
          Start New Quote
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        width={400}
      >
        {selectedQuote && (
          <Result
            status="success"
            title="Great Choice!"
            subTitle={`You are redirecting to ${selectedQuote.provider} to finalize your ${selectedQuote.coverageType} policy for $${selectedQuote.price}/mo.`}
            extra={[
              <Button type="primary" key="console" onClick={handleGoToSite}>
                Finish at {selectedQuote.provider}
              </Button>,
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default QuoteResults;
