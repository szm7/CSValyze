import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  // State management for EDA results and component state
  const [edaResults, setEdaResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const [showVisualization, setShowVisualization] = useState(false);
  const [showChatGPTModal, setShowChatGPTModal] = useState(false);

  const handleVisualizationClick = () => {
    setShowVisualization(prevState => !prevState);
  };

  const handleChatGPTClick = () => {
    setShowChatGPTModal(true);
  };

  const handleCloseModal = () => {
    setShowChatGPTModal(false);
  };

  const handleNextClick = () => {
    navigate('/'); // IDK THE PATH TO BE FOR NEXT CLICK
  };

  // Navigation and location hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Effect hook to process uploaded file and fetching EDA results
  useEffect(() => {
    const processUploadedFile = async () => {
      try {
        // Checking if results were passed via navigation state
        const results = location.state?.edaResults;
        
        if (results) {
          setEdaResults(results);
          setIsLoading(false);
        } else {
          // Fallback error handling if no results found
          setError('No analysis results available');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error processing results:', err);
        setError('Failed to process file analysis');
        setIsLoading(false);
      }
    };

    processUploadedFile();
  }, [location]);

  // Render methods for different tabs
  const renderSummaryTab = () => {
    if (!edaResults) return null;
    
    return (
      <div className="summary-tab">
        <h2>Dataset Overview</h2>
        
        <div className="summary-grid">
          <div className="summary-item">
            <h3>Filename</h3>
            <p>{edaResults.filename}</p>
          </div>
          
          <div className="summary-item">
            <h3>Dataset Dimensions</h3>
            <p>{edaResults.shape[0]} rows, {edaResults.shape[1]} columns</p>
          </div>
        </div>
        
        <div className="summary-details">
          <h3>Column Analysis</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Data Type</th>
                <th>Non-Null Count</th>
                <th>Missing (%)</th>
                <th>Unique Values</th>
              </tr>
            </thead>
            <tbody>
              {edaResults.summary.map((col, index) => (
                <tr key={index}>
                  <td>{col.Column}</td>
                  <td>{col.dtypes}</td>
                  <td>{col['non-null']}</td>
                  <td>{col['Missing (%)'].toFixed(2)}%</td>
                  <td>{col.Uniques}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderVisualizationsTab = () => {
    if (!edaResults) return null;
    
    return (
      <div className="visualizations-tab">
        <h2>Data Visualizations</h2>
        
        {/* Numerical Distribution Plot */}
        <div className="visualization-section">
          <h3>Numerical Distribution</h3>
          <img 
            src={`data:image/png;base64,${edaResults.numerical_distribution}`} 
            alt="Numerical Distribution" 
            className="visualization-image"
          />
        </div>

        {/* Correlation Heatmap */}
        <div className="visualization-section">
          <h3>Correlation Heatmap</h3>
          <img 
            src={`data:image/png;base64,${edaResults.correlation_plot}`} 
            alt="Correlation Heatmap" 
            className="visualization-image"
          />
        </div>

        {/* Categorical Distributions */}
        <div className="visualization-section">
          <h3>Categorical Distributions</h3>
          {Object.entries(edaResults.categorical_distributions).map(([col, plot]) => (
            <div key={col} className="categorical-distribution">
              <h4>{col} Distribution</h4>
              <img 
                src={`data:image/png;base64,${plot}`} 
                alt={`${col} Distribution`} 
                className="visualization-image"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDescriptiveStatsTab = () => {
    if (!edaResults) return null;
    
    return (
      <div className="descriptive-stats-tab">
        <h2>Descriptive Statistics</h2>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Statistic</th>
              {Object.keys(edaResults.descriptive_stats).map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'].map(stat => (
              <tr key={stat}>
                <td>{stat}</td>
                {Object.keys(edaResults.descriptive_stats).map(col => (
                  <td key={col}>
                    {edaResults.descriptive_stats[col][stat] 
                      ? edaResults.descriptive_stats[col][stat].toFixed(2) 
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Navigation handlers
  const handleHomeClick = () => {
    navigate("/");
  };

  // Conditional rendering based on loading and error states
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Processing your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleHomeClick}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <h1 className="headline">Analysis Results</h1>
      <p className="subheadline">Here are the insights from your analysis:</p>

      <div className="results-container">
        <div className="result-item">
          <h2>Accuracy</h2>
          <p>95%</p>
        </div>
        <div className="result-item">
          <h2>Precision</h2>
          <p>92%</p>
        </div>
        <div className="result-item">
          <h2>Recall</h2>
          <p>90%</p>
        </div>
        <div className="result-item">
          <h2>Algorithm</h2>
          <p>Algorithm 1</p>
        </div>
      </div>

      <button className="visualization-button" onClick={handleVisualizationClick}>
        {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
      </button>

      {showVisualization && (
        <div className="visualization-content">
          <h2>Data Visualization (Placeholder)</h2>
          <div className="chart-placeholder">
            <p>Chart will be rendered here...</p>
          </div>
        </div>
      )}

      {/* ChatGPT Logo Button */}
      <img
        src="./img/gemini.png" // Update this path to the actual ChatGPT logo image file
        alt="ChatGPT Logo"
        className="chatgpt-logo-button"
        onClick={handleChatGPTClick} // Open the modal on click
      />

      {/* Modal for ChatGPT Button */}
      {showChatGPTModal && (
        <div className="chatgpt-modal">
          <h2>ChatGPT Results</h2>
          <p>Here are the detailed results from the algorithm evaluation process:</p>
          <p><strong>Accuracy:</strong> 95%</p>
          <p><strong>Precision:</strong> 92%</p>
          <p><strong>Recall:</strong> 90%</p>
          <p><strong>Algorithm Used:</strong> Algorithm 1</p>
          <button className="modal-close-btn" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      )}

      {/* Updated Swipe Button */}
      <div className="swipe-button-container" onClick={handleNextClick}>
        <button className="swipe-button">
          <span>Resume</span>
          <div className="arrow-container">
            <div className="arrow"></div>
          </div>
        </button>
      </div>

      {/* Dynamic Tab Content */}
      <div className="tab-content">
        {activeTab === 'summary' && renderSummaryTab()}
        {activeTab === 'visualizations' && renderVisualizationsTab()}
        {activeTab === 'descriptive-stats' && renderDescriptiveStatsTab()}
      </div>

      {/* Home Navigation Icon */}
      <div className="home-icon" onClick={handleHomeClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3l9 8h-3v10h-12v-10h-3z" />
        </svg>
      </div>
    </div>
  );
};

export default ResultPage;