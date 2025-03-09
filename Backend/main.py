vfrom fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import uvicorn
from finance_ai import FinanceAI
from models import FinancialInput, FinancialReport

app = FastAPI(title="AI Finance Copilot API")
finance_ai = FinanceAI()

@app.get("/")
async def root():
    return {"message": "Welcome to AI Finance Copilot API"}

@app.post("/generate-advice", response_model=FinancialReport)
async def generate_financial_advice(input_data: FinancialInput):
    """
    Generate personalized financial advice based on user input
    """
    try:
        # Process input and generate report
        report = finance_ai.generate_report(
            income=input_data.income,
            expenses=input_data.expenses,
            risk_level=input_data.risk_level
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/investment-options/{risk_level}")
async def get_investment_options(risk_level: str):
    """
    Get real-time investment options based on risk level
    """
    try:
        # Get updated investment recommendations
        investments = finance_ai.get_current_investments(risk_level)
        return {"risk_level": risk_level, "investments": investments}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)