document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const incomeInput = document.getElementById('income');
    const expensesInput = document.getElementById('expenses');
    const riskLevelSelect = document.getElementById('risk-level');
    const generateButton = document.getElementById('generate-button');
    const errorMessage = document.getElementById('error-message');
    const reportContainer = document.getElementById('report-container');
    const welcomeMessage = document.getElementById('welcome-message');
  
    // Tab navigation
    const tabOverview = document.getElementById('tab-overview');
    const tabInvestments = document.getElementById('tab-investments');
    const tabCharts = document.getElementById('tab-charts');
    const overviewTab = document.getElementById('overview-tab');
    const investmentsTab = document.getElementById('investments-tab');
    const chartsTab = document.getElementById('charts-tab');
  
    // Chart instances
    let budgetPieChart = null;
    let riskComparisonChart = null;
    let yieldComparisonChart = null;
    let yieldTrendChart = null;
  
    // Colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const RISK_COLORS = {
      'Low': '#4CAF50',
      'Medium': '#2196F3',
      'Bro Danger': '#F44336'
    };
  
    // State variables
    let report = null;
    let loading = false;
  
    // Event listeners
    incomeInput.addEventListener('input', validateInputs);
    expensesInput.addEventListener('input', validateInputs);
    riskLevelSelect.addEventListener('change', validateInputs);
    generateButton.addEventListener('click', generateAdvice);
  
    // Tab navigation
    tabOverview.addEventListener('click', () => switchTab('overview'));
    tabInvestments.addEventListener('click', () => switchTab('investments'));
    tabCharts.addEventListener('click', () => switchTab('charts'));
  
    // Functions
    function validateInputs() {
      const income = parseFloat(incomeInput.value);
      const expenses = parseFloat(expensesInput.value);
      
      if (income && expenses !== undefined && income > 0) {
        generateButton.disabled = false;
      } else {
        generateButton.disabled = true;
      }
      
      errorMessage.classList.add('hidden');
    }
  
    function switchTab(tabName) {
      // Deactivate all tabs
      [tabOverview, tabInvestments, tabCharts].forEach(tab => tab.classList.remove('active'));
      [overviewTab, investmentsTab, chartsTab].forEach(content => content.classList.add('hidden'));
      
      // Activate the selected tab
      if (tabName === 'overview') {
        tabOverview.classList.add('active');
        overviewTab.classList.remove('hidden');
      } else if (tabName === 'investments') {
        tabInvestments.classList.add('active');
        investmentsTab.classList.remove('hidden');
      } else if (tabName === 'charts') {
        tabCharts.classList.add('active');
        chartsTab.classList.remove('hidden');
        
        // Ensure charts are rendered correctly
        setTimeout(() => {
          if (report) {
            renderCharts();
          }
        }, 100);
      }
    }
  
    async function generateAdvice() {
      const income = parseFloat(incomeInput.value);
      const expenses = parseFloat(expensesInput.value);
      const riskLevel = riskLevelSelect.value;
      
      if (!income || !expenses || income <= 0 || isNaN(income) || isNaN(expenses)) {
        errorMessage.textContent = 'Please enter valid income and expense values.';
        errorMessage.classList.remove('hidden');
        return;
      }
      
      loading = true;
      generateButton.disabled = true;
      generateButton.textContent = 'Generating Advice...';
      errorMessage.classList.add('hidden');
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const savings = income - expenses;
        const savingsPercent = (savings / income * 100).toFixed(1);
        
        report = {
          income: income,
          expenses: expenses,
          savings: savings,
          savings_percent: parseFloat(savingsPercent),
          essential_expenses: income * 0.5,
          discretionary_spending: income * 0.3,
          savings_investments: income * 0.2,
          risk_level: riskLevel,
          investment_rationale: getInvestmentRationale(riskLevel),
          pro_tip: getProTip(riskLevel, parseFloat(savingsPercent)),
          investments: getInvestments(riskLevel)
        };
        
        updateUI();
        
      } catch (err) {
        errorMessage.textContent = 'Error fetching financial advice. Please try again.';
        errorMessage.classList.remove('hidden');
        console.error(err);
      } finally {
        loading = false;
        generateButton.disabled = false;
        generateButton.textContent = 'Generate Financial Advice';
      }
    }
  
    function updateUI() {
      if (!report) return;
      
      // Hide welcome message and show report
      welcomeMessage.classList.add('hidden');
      reportContainer.classList.remove('hidden');
      
      // Update overview tab
      document.getElementById('income-value').textContent = `$${report.income.toLocaleString()}`;
      document.getElementById('expenses-value').textContent = `$${report.expenses.toLocaleString()}`;
      document.getElementById('savings-value').textContent = `$${report.savings.toLocaleString()}`;
      document.getElementById('savings-percent').textContent = ` (${report.savings_percent}%)`;
      
      document.getElementById('essential-value').textContent = `$${report.essential_expenses.toLocaleString()}`;
      document.getElementById('discretionary-value').textContent = `$${report.discretionary_spending.toLocaleString()}`;
      document.getElementById('savings-investment-value').textContent = `$${report.savings_investments.toLocaleString()}`;
      
      document.getElementById('pro-tip-text').textContent = report.pro_tip;
      
      // Update investments tab
      const riskBadge = document.getElementById('risk-level-badge');
      riskBadge.textContent = report.risk_level;
      riskBadge.className = 'risk-badge';
      riskBadge.classList.add(report.risk_level === 'Low' ? 'low' : report.risk_level === 'Medium' ? 'medium' : 'high');
      
      document.getElementById('investment-rationale-text').textContent = report.investment_rationale;
      
      const investmentsList = document.getElementById('investments-list');
      investmentsList.innerHTML = '';
      
      report.investments.forEach((inv, index) => {
        const investmentCard = document.createElement('div');
        investmentCard.className = 'investment-card';
        investmentCard.style.borderColor = COLORS[index % COLORS.length];
        
        investmentCard.innerHTML = `
          <h3>${inv.name}</h3>
          <div class="investment-metrics">
            <div class="investment-metric">
              <p class="metric-label">Current Yield</p>
              <p class="metric-value yield">${inv.current_yield}%</p>
            </div>
            <div class="investment-metric">
              <p class="metric-label">Risk Score</p>
              <p class="metric-value risk" style="color: ${
                inv.risk_score < 3 ? '#4CAF50' : 
                inv.risk_score < 7 ? '#2196F3' : '#F44336'
              };">${inv.risk_score}/10</p>
            </div>
          </div>
          <p class="investment-description">${inv.description}</p>
        `;
        
        investmentsList.appendChild(investmentCard);
      });
      
      // Update charts
      renderBudgetPieChart();
      switchTab('overview');
    }
  
    function renderBudgetPieChart() {
      if (!report) return;
      
      const ctx = document.getElementById('budget-pie-chart');
      
      if (budgetPieChart) {
        budgetPieChart.destroy();
      }
      
      const data = getBudgetPieData();
      
      budgetPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.map(item => item.name),
          datasets: [{
            data: data.map(item => item.value),
            backgroundColor: COLORS.slice(0, data.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  
    function renderCharts() {
      if (!report) return;
      
      renderRiskComparisonChart();
      renderYieldComparisonChart();
      renderYieldTrendChart();
    }
  
    function renderRiskComparisonChart() {
      const ctx = document.getElementById('risk-comparison-chart');
      
      if (riskComparisonChart) {
        riskComparisonChart.destroy();
      }
      
      const data = getRiskScoreData();
      
      riskComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.name),
          datasets: [{
            label: 'Risk Score',
            data: data.map(item => item.score),
            backgroundColor: '#8884d8',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 10
            }
          }
        }
      });
    }
  
    function renderYieldComparisonChart() {
      const ctx = document.getElementById('yield-comparison-chart');
      
      if (yieldComparisonChart) {
        yieldComparisonChart.destroy();
      }
      
      const data = getYieldComparisonData();
      
      yieldComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.name),
          datasets: [{
            label: 'Current Yield %',
            data: data.map(item => item.yield),
            backgroundColor: '#82ca9d',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }
  
    function renderYieldTrendChart() {
      const ctx = document.getElementById('yield-trend-chart');
      
      if (yieldTrendChart) {
        yieldTrendChart.destroy();
      }
      
      if (report.investments && report.investments.length > 0) {
        const data = getTrendData(0);
        const investmentName = report.investments[0].name;
        
        document.getElementById('yield-trend-title').textContent = `6-Month Yield Trend: ${investmentName}`;
        
        yieldTrendChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.map(item => item.month),
            datasets: [{
              label: 'Yield %',
              data: data.map(item => item.yield),
              backgroundColor: COLORS[0],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }
        });
      }
    }
  
    // Helper functions
    function getBudgetPieData() {
      if (!report) return [];
      
      return [
        { name: 'Essential', value: report.essential_expenses },
        { name: 'Discretionary', value: report.discretionary_spending },
        { name: 'Savings', value: report.savings_investments }
      ];
    }
  
    function getRiskScoreData() {
      if (!report) return [];
      
      return report.investments.map(inv => ({
        name: inv.name,
        score: inv.risk_score,
        maxScore: 10
      }));
    }
  
    function getYieldComparisonData() {
      if (!report) return [];
      
      return report.investments.map(inv => ({
        name: inv.name,
        yield: inv.current_yield
      }));
    }
  
    function getTrendData(investmentIndex) {
      if (!report || !report.investments[investmentIndex]) return [];
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return report.investments[investmentIndex].historical_data.map((value, index) => ({
        month: months[index],
        yield: value
      }));
    }
  
    function getInvestmentRationale(risk) {
      switch(risk) {
        case 'Low':
          return "Focus on capital preservation with steady, modest returns and minimal volatility.";
        case 'Medium':
          return "Balance between growth and safety with moderate volatility tolerance.";
        case 'Bro Danger':
          return "Maximum growth potential with significant volatility. Not for the faint of heart!";
        default:
          return "";
      }
    }
  
    function getProTip(risk, savingsPercent) {
      if (savingsPercent < 10) {
        return "Consider the 50/30/20 rule to increase your savings rate - your future self will thank you.";
      }
      
      switch(risk) {
        case 'Low':
          return "Build an emergency fund covering 6 months of expenses before investing elsewhere.";
        case 'Medium':
          return "Consider dollar-cost averaging to reduce timing risk in the market.";
        case 'Bro Danger':
          return "Only allocate money you can afford to lose to high-risk investments. Diversify across sectors and geographies.";
        default:
          return "";
      }
    }
  
    function getInvestments(risk) {
      switch(risk) {
        case 'Low':
          return [
            {
              name: "Treasury Bonds (10-Year)",
              current_yield: 4.2,
              risk_score: 1.2,
              description: "Government-backed bonds with very low risk profile",
              historical_data: [3.8, 3.9, 4.0, 4.1, 4.2, 4.3]
            },
            {
                name: "High-Yield Savings Account",
                current_yield: 4.5,
                risk_score: 0.5,
                description: "FDIC-insured savings with competitive interest rates",
                historical_data: [3.5, 3.8, 4.0, 4.2, 4.5, 4.5]
              },
              {
                name: "Short-Term Corporate Bonds ETF",
                current_yield: 4.8,
                risk_score: 2.1,
                description: "Diversified exposure to investment-grade corporate bonds",
                historical_data: [4.0, 4.2, 4.5, 4.6, 4.7, 4.8]
              }
            ];
          case 'Medium':
            return [
              {
                name: "S&P 500 Index Fund",
                current_yield: 1.7,
                risk_score: 5.5,
                description: "Broad market exposure to large US companies",
                historical_data: [1.5, 1.6, 1.5, 1.6, 1.7, 1.7]
              },
              {
                name: "Dividend Aristocrats ETF",
                current_yield: 2.8,
                risk_score: 4.2,
                description: "Companies with 25+ years of dividend increases",
                historical_data: [2.5, 2.6, 2.7, 2.7, 2.8, 2.8]
              },
              {
                name: "Balanced 60/40 Fund",
                current_yield: 3.2,
                risk_score: 4.8,
                description: "Classic portfolio with 60% stocks and 40% bonds",
                historical_data: [2.8, 2.9, 3.0, 3.1, 3.2, 3.2]
              }
            ];
          case 'Bro Danger':
            return [
              {
                name: "Emerging Tech ETF",
                current_yield: 12.5,
                risk_score: 8.5,
                description: "High-growth potential in cutting-edge technologies",
                historical_data: [8.0, 9.5, 10.0, 11.5, 12.0, 12.5]
              },
              {
                name: "Small Cap Growth Fund",
                current_yield: 14.0,
                risk_score: 8.9,
                description: "Aggressive growth through smaller companies",
                historical_data: [10.0, 11.0, 12.0, 12.5, 13.5, 14.0]
              },
              {
                name: "Crypto-Adjacent Equities",
                current_yield: 18.5,
                risk_score: 9.7,
                description: "Companies with exposure to digital assets ecosystem",
                historical_data: [12.0, 14.0, 15.0, 16.0, 17.0, 18.5]
              }
            ];
          default:
            return [];
        }
      }
    
      // Initialize the app
      validateInputs();
    });