"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  var router = useRouter();
  var [currentDate, setCurrentDate] = useState(new Date());
  var [reviewText, setReviewText] = useState("");
  var [isCompleted, setIsCompleted] = useState(false);
  var [loading, setLoading] = useState(true);

  var dateStr = currentDate.toISOString().split("T")[0];

  useEffect(function() {
    setLoading(true);
    try {
      var saved = localStorage.getItem("review_" + dateStr);
      if (saved) {
        var data = JSON.parse(saved);
        setReviewText(data.reviewText || "");
        setIsCompleted(data.completed || false);
      } else {
        setReviewText("");
        setIsCompleted(false);
      }
    } catch (err) {
      setReviewText("");
      setIsCompleted(false);
    }
    setLoading(false);
  }, [dateStr]);

  function saveData() {
    try {
      localStorage.setItem("review_" + dateStr, JSON.stringify({
        reviewText: reviewText,
        completed: true,
        timestamp: new Date().toISOString(),
      }));
      setIsCompleted(true);
      alert("今日複盤已儲存！");
    } catch (err) {
      alert("儲存失敗，請重試");
    }
  }

  function changeDate(days) {
    var d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  }

  function formatDate(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var days = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    return m + "月" + d + "日 " + days[date.getDay()];
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#7BC2A8" }}>載入中...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 80px)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
        <button onClick={function() { router.back(); }} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#7BC2A8", fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>
          ←
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center" }}>
          <button onClick={function() { changeDate(-1); }} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#7BC2A8", fontSize: 18, background: "none", border: "none", cursor: "pointer" }}>‹</button>
          <div style={{ textAlign: "center", minWidth: 140 }}>
            <p style={{ fontSize: 18, fontWeight: "bold", color: "#2D4A3E", margin: 0 }}>今日複盤</p>
            <p style={{ fontSize: 14, color: "#7BC2A8", margin: "2px 0 0 0" }}>{formatDate(currentDate)}</p>
          </div>
          <button onClick={function() { changeDate(1); }} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#7BC2A8", fontSize: 18, background: "none", border: "none", cursor: "pointer" }}>›</button>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {isCompleted ? (
        <div style={{ margin: "0 16px 12px", backgroundColor: "#7BC2A8", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "white" }}>✓</span>
          <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>今日複盤已完成</span>
        </div>
      ) : null}

      <div style={{ flex: 1, padding: "0 16px", paddingBottom: 96 }}>
        <div style={{ backgroundColor: "white", borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: "bold", color: "#2D4A3E", marginBottom: 16 }}>✍️ 今天的複盤...</h2>
          <textarea
            value={reviewText}
            onChange={function(e) { setReviewText(e.target.value); }}
            placeholder="寫下今天的反思與覺察..."
            style={{ width: "100%", minHeight: 300, backgroundColor: "#F5F9F7", borderRadius: 12, padding: 16, fontSize: 16, color: "#2D4A3E", border: "none", outline: "none", resize: "none", lineHeight: 1.6 }}
          />
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 80, left: 0, right: 0, padding: "12px 16px 16px", backgroundColor: "#F5F9F7" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <button
            onClick={saveData}
            disabled={isCompleted}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              backgroundColor: isCompleted ? "#5A9B8A" : "#7BC2A8",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: isCompleted ? "not-allowed" : "pointer",
              opacity: isCompleted ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span>✓</span>
            <span>{isCompleted ? "已完成" : "完成"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
