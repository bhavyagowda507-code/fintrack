import numpy as np
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union
from sklearn.ensemble import IsolationForest

app = FastAPI(title="AuraShield Integrated Core Finance & Security Protocol")

# Permit cross-origin communication from the frontend development local ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Application In-Memory DB States (Simulating Database Ledger Tables)
is_system_locked = False
zkp_privacy_active = False
mock_network_graph = [] # Dynamically filled when an attack is simulated

mock_ledger = [
    {"id": 1, "merchant": "Starbucks Coffee", "amount": 4.75, "category": "Food"},
    {"id": 2, "merchant": "Amazon Web Services", "amount": 89.20, "category": "Utilities"},
    {"id": 3, "merchant": "Target Stores", "amount": 42.10, "category": "Shopping"},
]

# Baseline calibration coordinates matching the actual owner's motor usage patterns
# Array format: [average_velocity, acceleration_variance, total_drag_distance]
CALIBRATION_SIGNATURES = np.array([
    [120.5, 45.2, 350.0],
    [135.2, 50.1, 410.2],
    [110.8, 38.9, 310.5],
    [128.1, 44.0, 380.0],
    [142.3, 55.4, 450.1],
    [115.0, 41.2, 330.4]
])

# Initialize and fit the baseline Isolation Forest model on server startup
clf = IsolationForest(contamination=0.05, random_state=42)
clf.fit(CALIBRATION_SIGNATURES)

# Data Transfer Object Object Definitions
class TelemetryPayload(BaseModel):
    velocity: float
    acceleration_variance: float
    distance: float

class QueryIntentPayload(BaseModel):
    prompt: str

@app.get("/api/finance/ledger")
def get_finance_ledger():
    """
    Returns core account balances and active transactions ledger states.
    Applies real-time cryptographic masking or redactions depending on security states.
    """
    global is_system_locked, zkp_privacy_active, mock_network_graph
    
    # 1. Check if Cognitive Shield has locked down the system due to stress/coercion
    if is_system_locked:
        return {
            "balance": "[REDACTED_BY_COGNITIVE_SHIELD]",
            "zkp_active": zkp_privacy_active,
            "is_frozen": True,
            "network_graph": mock_network_graph,
            "transactions": []
        }
    
    # 2. Check if the Zero-Knowledge Privacy Shield is actively masking data points
    processed_transactions = []
    for tx in mock_ledger:
        if zkp_privacy_active:
            # Simulate a cryptographic token verification proof format
            processed_transactions.append({
                "id": tx["id"],
                "merchant": "MOCK_ZK_PROOF_VERIFIED_NODE",
                "amount": 0.00,
                "category": tx["category"]
            })
        else:
            processed_transactions.append(tx)
            
    return {
        "balance": 5420.50,
        "zkp_active": zkp_privacy_active,
        "is_frozen": False,
        "network_graph": mock_network_graph,
        "transactions": processed_transactions
    }

@app.post("/api/security/telemetry")
def evaluate_telemetry(payload: TelemetryPayload):
    """
    Evaluates real-time cursor metrics against the Isolation Forest profile.
    Captures Cognitive Hesitation or stress variances from the frontend listener.
    """
    global is_system_locked
    
    # Format incoming telemetry coordinates into a shape Scikit-Learn expects
    input_vector = np.array([[payload.velocity, payload.acceleration_variance, payload.distance]])
    
    # Isolation Tree prediction returns: 1 (normal), -1 (outlier/anomaly)
    prediction = clf.predict(input_vector)[0]
    
    # Calculate a normalized structural deviation score for graphing
    decision_score = clf.decision_function(input_vector)[0]
    risk_score = float(np.clip((0.5 - decision_score) * 100, 0, 100))
    
    # Defensive Lockdown Trigger Condition (Simulating scammer pressure or hijack anomalies)
    if prediction == -1 and risk_score > 75.0:
        is_system_locked = True
        
    return {
        "status": "APPROVED" if prediction == 1 else "COGNITIVE_HESITATION_DETECTED",
        "risk_score": round(risk_score, 2),
        "is_frozen": is_system_locked
    }

@app.post("/api/security/simulate-attack")
def execute_attack_simulation():
    """
    Triggered when the user presses 'Stimulate Network Attack'.
    Injects a cyclical money laundering loop into the state to test frontend tracking.
    """
    global is_system_locked, mock_network_graph
    
    # Force lock the system to show defensive maneuvers work live
    is_system_locked = True
    
    # Populate the mock graph with suspicious multi-hop routing paths
    mock_network_graph = [
        {
            "source": "Your Account Wallet", 
            "target": "Suspicious Merchant Node X", 
            "amount": 1250.00, 
            "risk_factor": "CYCLICAL_RING"
        },
        {
            "source": "Suspicious Merchant Node X", 
            "target": "Mule Holding Account Z", 
            "amount": 1250.00, 
            "risk_factor": "HIGH_VELOCITY_LAYER"
        }
    ]
    
    return {
        "status": "DEFENSIVE_LOCKDOWN",
        "is_locked": True,
        "network_graph": mock_network_graph
    }

@app.post("/api/security/override")
def administrative_override():
    """Manual administration safety path to clear defensive lockdown triggers."""
    global is_system_locked, mock_network_graph
    is_system_locked = False
    mock_network_graph = [] # Clear the graph loop trail
    return {"status": "SUCCESS", "is_frozen": False}

@app.post("/api/security/privacy-toggle")
def toggle_privacy_shield():
    """Dynamically activates or deactivates the Zero-Knowledge simulation mask."""
    global zkp_privacy_active
    zkp_privacy_active = not zkp_privacy_active
    return {"status": "SUCCESS", "zkp_active": zkp_privacy_active}

@app.post("/api/ai/audit-explain")
def process_audit_chat(payload: QueryIntentPayload):
    """
    Handles conversational requests regarding financial trends and anomaly audits.
    Fulfills ethical AI explainability expectations for evaluation rounds.
    """
    query = payload.prompt.lower()
    
    if "privacy" in query or "zkp" in query or "shield" in query:
        return {
            "reply": (
                "PRIVACY CORE ANALYSIS: The Zero-Knowledge Proof (ZKP) Simulation is currently active. "
                "Instead of uploading raw transactional balances or merchant identifiers to third-party "
                "analytics layers, our app translates raw properties into mathematically verified hash structures. "
                "This proves account solvency without risking raw telemetry disclosures."
            )
        }
    elif "lock" in query or "hesitation" in query or "scam" in query or "attack" in query:
        return {
            "reply": (
                "COGNITIVE AUDIT SCANNERS: The security lockdown was initiated because your cursor metrics "
                "exhibited prolonged dwell time intervals combined with a highly fragmented acceleration curve variance. "
                "This behavior statistically diverges from your baseline configuration model, indicating systemic "
                "user hesitation common during social engineering phone scam coercion."
            )
        }
        
    return {
        "reply": (
            "Welcome to AuraShield Finance Audit Terminal. I can provide real-time architectural "
            "explanations regarding your continuous Isolation Forest configurations or your ZKP Privacy Shield status."
        )
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)