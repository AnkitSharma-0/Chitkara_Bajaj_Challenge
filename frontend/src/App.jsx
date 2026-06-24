import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!input.trim()) {
      alert("Please enter hierarchy data");
      return;
    }

    try {

      setLoading(true);

      const formattedData = input
        .split(",")
        .map(item => item.trim());

      const res = await axios.post(
        "http://localhost:3000/api/bfhl",
        {
          data: formattedData
        }
      );

      setResponse(res.data);

    } catch (error) {

      console.error(error);

      setResponse({
        success: false,
        message: "Failed to connect with backend API"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">

      <div className="card">

        <h1>Hierarchy Processor API</h1>

        <p className="subtitle">
          Enter graph edges separated by commas
        </p>

        <textarea
          placeholder="Example: A->B, B->C, A->D"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {loading ? "Processing..." : "Generate Hierarchy"}
        </button>

        {response && (
          <div className="response-box">
            <pre>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
}

export default App;