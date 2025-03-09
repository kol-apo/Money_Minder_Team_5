from pydantic import BaseModel, Field, validator
from typing import List, Optional

class InvestmentOption(BaseModel):
    """
    Model for an individual investment option with real-time data
    """
    name: str
    current_yield: float
    risk_score: float  # Scale of 0-10
    description: str

class FinancialInput(BaseModel):
    """
    User input model for financial advice
    """
    income: float = Field(..., gt=0, description="Monthly income in USD")
    expenses: float = Field(..., ge=0, description="Monthly expenses in USD")
    risk_level: str = Field(..., description="Investment risk tolerance")
    
    @validator('risk_level')
    def validate_risk_level(cls, v):
        valid_levels = ["Low", "Medium", "Bro Danger"]
        if v not in valid_levels:
            raise ValueError(f"Risk level must be one of: {', '.join(valid_levels)}")
        return v

class FinancialReport(BaseModel):
    """
    Comprehensive financial report model
    """
    # Basic financial data
    income: float
    expenses: float
    savings: float
    savings_percent: float
    
    # Budget breakdown
    essential_expenses: float
    discretionary_spending: float
    savings_investments: float
    
    # Investment advice
    risk_level: str
    investments: List[InvestmentOption]
    investment_rationale: str
    
    # Financial tips
    pro_tip: str