import datetime
import random
from typing import List, Dict, Any
from models import FinancialReport, InvestmentOption

class FinanceAI:
    """
    Core AI logic for financial advice
    """
    
    def __init__(self):
        # Initialize with current timestamp for real-time investment options
        self.last_update = datetime.datetime.now()
        # Sample market data - in production would connect to financial APIs
        self.market_data = self._get_market_data()
    
    def generate_report(self, income: float, expenses: float, risk_level: str) -> FinancialReport:
        """
        Generate comprehensive financial report based on user inputs
        """
        # Validate risk level
        self._validate_risk_level(risk_level)
        
        # Calculate basic financial metrics
        savings = income - expenses
        savings_percent = (savings / income * 100) if income > 0 else 0
        
        # 50/30/20 budget breakdown
        essential_expenses = income * 0.5
        discretionary_spending = income * 0.3
        savings_investments = income * 0.2
        
        # Get real-time investment recommendations
        investments = self.get_current_investments(risk_level)
        
        # Generate personalized advice
        pro_tip = self._generate_pro_tip(risk_level, savings_percent)
        investment_rationale = self._get_investment_rationale(risk_level)
        
        # Create and return report
        return FinancialReport(
            income=income,
            expenses=expenses,
            savings=savings,
            savings_percent=round(savings_percent, 1),
            essential_expenses=essential_expenses,
            discretionary_spending=discretionary_spending,
            savings_investments=savings_investments,
            risk_level=risk_level,
            investments=investments,
            investment_rationale=investment_rationale,
            pro_tip=pro_tip
        )
    
    def get_current_investments(self, risk_level: str) -> List[InvestmentOption]:
        """
        Get current investment recommendations based on risk level and market conditions
        """
        self._validate_risk_level(risk_level)
        
        # Update market data if it's been more than a day
        current_time = datetime.datetime.now()
        if (current_time - self.last_update).days >= 1:
            self.market_data = self._get_market_data()
            self.last_update = current_time
        
        # Filter investments by risk level
        if risk_level == "Low":
            return [
                InvestmentOption(
                    name="Treasury Bonds (10-Year)",
                    current_yield=self.market_data["treasury_10y_yield"],
                    risk_score=1.2,
                    description="Government-backed bonds with very low risk profile"
                ),
                InvestmentOption(
                    name="High-Yield Savings Account",
                    current_yield=self.market_data["high_yield_savings_rate"],
                    risk_score=0.5,
                    description="FDIC-insured savings with competitive interest rates"
                ),
                InvestmentOption(
                    name="Short-Term Corporate Bonds ETF",
                    current_yield=self.market_data["corp_bond_etf_yield"],
                    risk_score=2.1,
                    description="Diversified exposure to investment-grade corporate bonds"
                )
            ]
        elif risk_level == "Medium":
            return [
                InvestmentOption(
                    name="S&P 500 Index Fund",
                    current_yield=self.market_data["sp500_dividend_yield"],
                    risk_score=5.5,
                    description="Broad market exposure to large US companies"
                ),
                InvestmentOption(
                    name="Dividend Aristocrats ETF",
                    current_yield=self.market_data["dividend_aristocrats_yield"],
                    risk_score=4.2,
                    description="Companies with 25+ years of dividend increases"
                ),
                InvestmentOption(
                    name="Balanced 60/40 Fund",
                    current_yield=self.market_data["balanced_fund_yield"],
                    risk_score=4.8,
                    description="Classic portfolio with 60% stocks and 40% bonds"
                )
            ]
        elif risk_level == "Bro Danger":
            return [
                InvestmentOption(
                    name="Emerging Tech ETF",
                    current_yield=self.market_data["tech_etf_growth_rate"],
                    risk_score=8.5,
                    description="High-growth potential in cutting-edge technologies"
                ),
                InvestmentOption(
                    name="Small Cap Growth Fund",
                    current_yield=self.market_data["small_cap_growth_rate"],
                    risk_score=8.9,
                    description="Aggressive growth through smaller companies"
                ),
                InvestmentOption(
                    name="Crypto-Adjacent Equities",
                    current_yield=self.market_data["crypto_equities_growth_rate"],
                    risk_score=9.7,
                    description="Companies with exposure to digital assets ecosystem"
                )
            ]
    
    def _validate_risk_level(self, risk_level: str) -> None:
        """
        Validate risk level input
        """
        valid_risk_levels = ["Low", "Medium", "Bro Danger"]
        if risk_level not in valid_risk_levels:
            raise ValueError(f"Risk level must be one of: {', '.join(valid_risk_levels)}")
    
    def _get_market_data(self) -> Dict[str, float]:
        """
        Simulated market data - would connect to financial APIs in production
        """
        # In a real implementation, this would pull from financial APIs
        return {
            # Low risk options
            "treasury_10y_yield": round(random.uniform(3.8, 4.5), 2),
            "high_yield_savings_rate": round(random.uniform(3.5, 5.0), 2),
            "corp_bond_etf_yield": round(random.uniform(4.0, 5.5), 2),
            
            # Medium risk options
            "sp500_dividend_yield": round(random.uniform(1.3, 2.0), 2),
            "dividend_aristocrats_yield": round(random.uniform(2.2, 3.0), 2),
            "balanced_fund_yield": round(random.uniform(2.5, 3.5), 2),
            
            # High risk options
            "tech_etf_growth_rate": round(random.uniform(8.0, 15.0), 2),
            "small_cap_growth_rate": round(random.uniform(7.0, 18.0), 2),
            "crypto_equities_growth_rate": round(random.uniform(10.0, 25.0), 2),
        }
    
    def _get_investment_rationale(self, risk_level: str) -> str:
        """
        Generate investment rationale based on risk level
        """
        if risk_level == "Low":
            return "Focus on capital preservation with steady, modest returns and minimal volatility."
        elif risk_level == "Medium":
            return "Balance between growth and safety with moderate volatility tolerance."
        elif risk_level == "Bro Danger":
            return "Maximum growth potential with significant volatility. Not for the faint of heart!"
    
    def _generate_pro_tip(self, risk_level: str, savings_percent: float) -> str:
        """
        Generate personalized financial tip based on user's situation
        """
        if savings_percent < 10:
            return "Consider the 50/30/20 rule to increase your savings rate - your future self will thank you."
        
        if risk_level == "Low":
            return "Build an emergency fund covering 6 months of expenses before investing elsewhere."
        elif risk_level == "Medium":
            return "Consider dollar-cost averaging to reduce timing risk in the market."
        else:  # Bro Danger
            return "Only allocate money you can afford to lose to high-risk investments. Diversify across sectors and geographies."
