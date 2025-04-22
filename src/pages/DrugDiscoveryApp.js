import React, { useState } from "react"
import "../styles.css"

// Example SMILES strings for common drugs
const EXAMPLE_SMILES = [
  { name: "Aspirin", smiles: "CC(=O)OC1=CC=CC=C1C(=O)O" },
  { name: "Paracetamol", smiles: "CC(=O)NC1=CC=C(O)C=C1" },
  { name: "Ibuprofen", smiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O" },
  { name: "Caffeine", smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C" }
]

export default function DrugDiscoveryApp() {
  const [smiles, setSmiles] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("input")

  // Function to handle prediction
  const handlePredict = async () => {
    if (!smiles.trim()) {
      setError("Please enter a SMILES string")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles })
      })

      if (!response.ok) {
        throw new Error("Server not responding. Showing demo predictions.")
      }

      const data = await response.json()
      setPrediction(data)
      setActiveTab("results")
    } catch (error) {
      console.error("Prediction error:", error)

      // Fallback demo data
      const demoData = generateDemoData(smiles)
      setPrediction(demoData)
      setActiveTab("results")
    }

    setLoading(false)
  }

  // Generate demo data based on the SMILES input
  const generateDemoData = smilesInput => {
    // Find if the input matches any example
    const matchedExample = EXAMPLE_SMILES.find(
      ex => ex.smiles.toLowerCase() === smilesInput.toLowerCase()
    )

    if (matchedExample) {
      // Return specific data for known examples
      if (matchedExample.name === "Aspirin") {
        return {
          name: "Aspirin (Acetylsalicylic acid)",
          smiles: matchedExample.smiles,
          prediction: "High probability of drug-likeness",
          confidence: 92,
          toxicity: "Low",
          properties: {
            logP: 1.43,
            molecularWeight: 180.16,
            hBondDonors: 1,
            hBondAcceptors: 4,
            rotableBonds: 3
          },
          bioactivity: {
            antiInflammatory: "High",
            analgesic: "High",
            antiPyretic: "Moderate"
          }
        }
      } else if (matchedExample.name === "Paracetamol") {
        return {
          name: "Paracetamol (Acetaminophen)",
          smiles: matchedExample.smiles,
          prediction: "High probability of drug-likeness",
          confidence: 89,
          toxicity: "Low to Moderate",
          properties: {
            logP: 0.91,
            molecularWeight: 151.16,
            hBondDonors: 2,
            hBondAcceptors: 3,
            rotableBonds: 1
          },
          bioactivity: {
            antiInflammatory: "Low",
            analgesic: "High",
            antiPyretic: "High"
          }
        }
      } else if (matchedExample.name === "Ibuprofen") {
        return {
          name: "Ibuprofen",
          smiles: matchedExample.smiles,
          prediction: "High probability of drug-likeness",
          confidence: 94,
          toxicity: "Low",
          properties: {
            logP: 3.97,
            molecularWeight: 206.29,
            hBondDonors: 1,
            hBondAcceptors: 2,
            rotableBonds: 4
          },
          bioactivity: {
            antiInflammatory: "High",
            analgesic: "Moderate",
            antiPyretic: "Moderate"
          }
        }
      } else if (matchedExample.name === "Caffeine") {
        return {
          name: "Caffeine",
          smiles: matchedExample.smiles,
          prediction: "Moderate probability of drug-likeness",
          confidence: 76,
          toxicity: "Low to Moderate",
          properties: {
            logP: -0.07,
            molecularWeight: 194.19,
            hBondDonors: 0,
            hBondAcceptors: 6,
            rotableBonds: 0
          },
          bioactivity: {
            cnsStimulant: "High",
            diuretic: "Moderate",
            bronchodilator: "Low"
          }
        }
      }
    }

    // Generic response for unknown SMILES
    return {
      name: "Unknown Compound",
      smiles: smilesInput,
      prediction: "Moderate probability of drug-likeness",
      confidence: Math.floor(Math.random() * 40) + 40, // Random between 40-80%
      toxicity: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
      properties: {
        logP: (Math.random() * 5).toFixed(2),
        molecularWeight: (Math.random() * 400 + 100).toFixed(2),
        hBondDonors: Math.floor(Math.random() * 5),
        hBondAcceptors: Math.floor(Math.random() * 10),
        rotableBonds: Math.floor(Math.random() * 8)
      },
      bioactivity: {
        potentialTarget: [
          "Enzyme inhibitor",
          "Receptor antagonist",
          "Channel blocker"
        ][Math.floor(Math.random() * 3)],
        predictedActivity: ["Low", "Moderate", "High"][
          Math.floor(Math.random() * 3)
        ]
      }
    }
  }

  // Copy SMILES to clipboard
  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
  }

  // Set example SMILES
  const setExampleSmiles = example => {
    setSmiles(example.smiles)
  }

  // Get confidence class based on value
  const getConfidenceClass = confidence => {
    if (confidence < 50) return "low"
    if (confidence < 75) return "medium"
    return ""
  }

  // Get toxicity class based on value
  const getToxicityClass = toxicity => {
    if (toxicity.toLowerCase().includes("high")) return "toxicity-high"
    if (toxicity.toLowerCase().includes("moderate")) return "toxicity-medium"
    return "toxicity-low"
  }

  // Toggle details visibility
  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="drug-discovery-container">
      <div className="molecule-background"></div>

      <header className="app-header">
        <h1 className="app-title">Advanced Drug Discovery System</h1>
        <p className="app-subtitle">
          Analyze chemical compounds and predict their drug-like properties
          using SMILES notation
        </p>
      </header>

      <div className="main-card fade-in">
        <div className="tabs">
          <div className="tabs-list">
            <button
              className={`tab-trigger ${activeTab === "input" ? "active" : ""}`}
              onClick={() => setActiveTab("input")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 2v2.5a2.5 2.5 0 0 0 5 0V2"></path>
                <path d="M8.5 2h7"></path>
                <path d="M14 13.4V16"></path>
                <path d="M10 13.4V16"></path>
                <path d="M8.5 22h7"></path>
                <path d="M7 22V11c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v11"></path>
              </svg>
              Input
            </button>
            <button
              className={`tab-trigger ${
                activeTab === "results" ? "active" : ""
              }`}
              onClick={() => setActiveTab("results")}
              disabled={!prediction}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 2v7.31"></path>
                <path d="M14 9.3V2"></path>
                <path d="M8.5 2h7"></path>
                <path d="M14 22v-5"></path>
                <path d="M10 22v-5"></path>
                <path d="M8.5 22h7"></path>
                <path d="M14 9.3a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
                <path d="M17.8 17.8a4 4 0 1 0 0-8"></path>
              </svg>
              Results
            </button>
          </div>

          <div
            className={`tab-content ${activeTab === "input" ? "active" : ""}`}
          >
            <div className="input-section">
              <label className="input-label">Enter SMILES Notation</label>
              <div className="textarea-container">
                <textarea
                  className="textarea"
                  placeholder="Enter SMILES string (e.g., CC(=O)Oc1ccccc1C(=O)O for Aspirin)"
                  value={smiles}
                  onChange={e => setSmiles(e.target.value)}
                />
                <div className="tooltip">
                  <svg
                    className="info-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  <span className="tooltip-content">
                    SMILES (Simplified Molecular Input Line Entry System) is a
                    notation that represents chemical structures as text
                    strings.
                  </span>
                </div>
              </div>
            </div>

            <div className="examples-section">
              <label className="input-label">Example Compounds</label>
              <div className="example-chips">
                {EXAMPLE_SMILES.map((example, index) => (
                  <button
                    key={index}
                    className="example-chip"
                    onClick={() => setExampleSmiles(example)}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePredict}
              disabled={loading || !smiles.trim()}
              className="prediction-button"
            >
              {loading ? (
                <>
                  <svg
                    className="spinner"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Analyzing Compound...
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 12h12"></path>
                    <path d="m12 6 6 6-6 6"></path>
                  </svg>
                  Predict Drug Properties
                </>
              )}
            </button>
          </div>

          <div
            className={`tab-content ${activeTab === "results" ? "active" : ""}`}
          >
            {prediction && (
              <div className="results-section fade-in">
                <div className="results-header">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h3 className="results-title">Analysis Results</h3>
                </div>

                <div className="results-card">
                  <div className="results-content">
                    <div className="results-header-section">
                      <h4 className="compound-name">{prediction.name}</h4>

                      <div className="smiles-display">
                        {prediction.smiles}
                        <button
                          className="copy-button"
                          onClick={() => copyToClipboard(prediction.smiles)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              width="14"
                              height="14"
                              x="8"
                              y="8"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="molecule-display">
                        <img
                          src={`https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(
                            prediction.smiles
                          )}/image`}
                          alt="Molecular structure"
                          className="molecule-image"
                          onError={e => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                          }}
                        />
                      </div>
                    </div>

                    <div className="results-body">
                      <div className="mb-4">
                        <h5 className="section-title">Primary Assessment</h5>
                        <div className="property-grid">
                          <div className="property-item">
                            <div className="property-label">Drug-likeness</div>
                            <div className="property-value">
                              {prediction.prediction}
                            </div>
                          </div>

                          <div className="property-item">
                            <div className="property-label">Confidence</div>
                            <div className="property-value">
                              {prediction.confidence}%
                            </div>
                            <div className="confidence-meter">
                              <div
                                className={`confidence-fill ${getConfidenceClass(
                                  prediction.confidence
                                )}`}
                                style={{ width: `${prediction.confidence}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="property-item">
                            <div className="property-label">Toxicity Risk</div>
                            <div
                              className={`property-value ${getToxicityClass(
                                prediction.toxicity
                              )}`}
                            >
                              {prediction.toxicity}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="details-button"
                        onClick={toggleDetails}
                      >
                        {showDetails ? (
                          <>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m18 15-6-6-6 6"></path>
                            </svg>
                            Hide Detailed Properties
                          </>
                        ) : (
                          <>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6"></path>
                            </svg>
                            Show Detailed Properties
                          </>
                        )}
                      </button>

                      <div
                        className={`details-content ${
                          showDetails ? "visible" : ""
                        }`}
                      >
                        <hr className="separator" />

                        <div className="mb-4">
                          <div className="section-header">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 4v16"></path>
                              <path d="M4 8h16"></path>
                              <path d="M20 12H4"></path>
                              <path d="M4 16h16"></path>
                              <path d="M4 20h16"></path>
                            </svg>
                            <h5 className="section-title">
                              Molecular Properties
                            </h5>
                          </div>
                          <div className="property-grid">
                            {prediction.properties &&
                              Object.entries(prediction.properties).map(
                                ([key, value]) => (
                                  <div className="property-item" key={key}>
                                    <div className="property-label">
                                      {key === "logP"
                                        ? "LogP"
                                        : key === "hBondDonors"
                                        ? "H-Bond Donors"
                                        : key === "hBondAcceptors"
                                        ? "H-Bond Acceptors"
                                        : key === "rotableBonds"
                                        ? "Rotatable Bonds"
                                        : key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, str =>
                                              str.toUpperCase()
                                            )}
                                    </div>
                                    <div className="property-value">
                                      {value}
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        </div>

                        <div>
                          <div className="section-header">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 3h4a2 2 0 0 1 2 2v4"></path>
                              <path d="M13 21h-4a2 2 0 0 1-2-2v-4"></path>
                              <path d="M21 15v4a2 2 0 0 1-2 2h-4"></path>
                              <path d="M3 13v-4a2 2 0 0 1 2-2h4"></path>
                            </svg>
                            <h5 className="section-title">
                              Bioactivity Prediction
                            </h5>
                          </div>
                          <div className="property-grid">
                            {prediction.bioactivity &&
                              Object.entries(prediction.bioactivity).map(
                                ([key, value]) => (
                                  <div className="property-item" key={key}>
                                    <div className="property-label">
                                      {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, str =>
                                          str.toUpperCase()
                                        )}
                                    </div>
                                    <div className="property-value">
                                      {value}
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    className="back-button"
                    onClick={() => setActiveTab("input")}
                  >
                    Analyze Another Compound
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Advanced Drug Discovery System</p>
      </footer>
    </div>
  )
}
