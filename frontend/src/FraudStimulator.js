import React from 'react';

const FraudSimulator = ({ systemState }) => {
  // Use optional chaining (?.) and fallback ([]) to prevent "undefined length" errors
  const networkNodes = systemState?.network_graph || [];

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid #1e293b' 
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#10b981', textTransform: 'uppercase' }}>
        Fraud Ring Network Tracer
      </h3>

      {networkNodes.length === 0 ? (
        <div style={{ 
          padding: '32px', 
          textAlign: 'center', 
          color: '#475569', 
          border: '1px dashed #1e293b', 
          borderRadius: '8px', 
          fontSize: '12px' 
        }}>
          No systemic network anomalies found. Graph pipeline tracking cleanly.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {networkNodes.map((edge, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '16px', 
              backgroundColor: '#070a13', 
              borderRadius: '6px', 
              borderLeft: '4px solid #ef4444' 
            }}>
              <div>
                <span style={{ color: '#64748b' }}>{edge?.source || "Unknown"}</span> ➔ 
                <span style={{ color: '#cbd5e1', marginLeft: '5px' }}>{edge?.target || "Unknown"}</span>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                ${edge?.amount ? edge.amount.toFixed(2) : "0.00"} 
                <span style={{ 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  marginLeft: '12px', 
                  backgroundColor: '#7f1d1d', 
                  color: '#fca5a5', 
                  borderRadius: '4px' 
                }}>
                  {edge?.risk_factor || "SUSPICIOUS"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudSimulator;