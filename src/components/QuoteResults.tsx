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
} from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { FormData, Quote } from "../types";

const { Title, Text } = Typography;

const QuoteResults: React.FC<{ data: FormData; onReset: () => void }> = ({
  data,
  onReset,
}) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (Keep your useEffect fetch logic the same) ...
  useEffect(() => {
    fetch("/.netlify/functions/get-quotes", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(setQuotes)
      .catch(() => setQuotes([])) // Simple error handling
      .finally(() => setLoading(false));
  }, [data]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 20, color: "#4f46e5" }}>
          Analyzing 50+ providers...
        </Title>
        <Text>Please wait while we calculate your risk profile.</Text>
      </div>
    );

  if (quotes.length === 0)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Alert
          message="No quotes available"
          description="Based on the data provided, we couldn't find a matching provider instantly."
          type="warning"
          showIcon
        />
        <Button onClick={onReset} style={{ marginTop: 20 }}>
          Modify Search
        </Button>
      </div>
    );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          🎉 Success!
        </Title>
        <Text type="secondary">
          We found {quotes.length} great options for you.
        </Text>
      </div>

      <List
        grid={{ gutter: 24, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
        dataSource={quotes}
        renderItem={(item, index) => (
          <List.Item>
            <Badge.Ribbon
              text={index === 0 ? "Best Value" : "Recommended"}
              color={index === 0 ? "#10b981" : "blue"}
              style={{ display: index > 1 ? "none" : "block" }}
            >
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  {/* Left: Provider Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
                      {item.provider}
                    </Title>
                    <div style={{ marginBottom: 8 }}>
                      <Rate
                        disabled
                        defaultValue={item.rating}
                        style={{ fontSize: 14 }}
                      />
                      <Text type="secondary" style={{ marginLeft: 8 }}>
                        ({item.rating})
                      </Text>
                    </div>
                    <Tag
                      color="cyan"
                      style={{ padding: "4px 8px", borderRadius: 4 }}
                    >
                      {item.coverage}
                    </Tag>

                    <div style={{ marginTop: 12 }}>
                      <Text type="secondary">
                        <CheckCircleFilled style={{ color: "#10b981" }} />{" "}
                        Instant Approval
                      </Text>
                    </div>
                  </div>

                  {/* Right: Price & Action */}
                  <div style={{ textAlign: "right", minWidth: 150 }}>
                    <Text type="secondary" style={{ display: "block" }}>
                      Monthly Premium
                    </Text>
                    <Title
                      level={2}
                      style={{ color: "#4f46e5", margin: 0, fontWeight: 800 }}
                    >
                      ${item.price}
                    </Title>
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        marginTop: 12,
                        width: "100%",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
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
        <Button type="dashed" onClick={onReset} size="large">
          Start New Quote
        </Button>
      </div>
    </div>
  );
};
export default QuoteResults;
