import logging
import json
from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ConversationHandler, ContextTypes
import requests
from config import TELEGRAM_TOKEN, API_BASE_URL

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

# Conversation states
INCOME, EXPENSES, RISK_LEVEL = range(3)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Start the conversation and ask for income."""
    await update.message.reply_text(
        "👋 Hi! I'm your AI Finance Copilot. Let's create your financial plan.\n\n"
        "First, what is your monthly income in USD? (just the number, e.g. 3000)"
    )
    return INCOME

async def income(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Store the income and ask for expenses."""
    user_text = update.message.text
    try:
        income_value = float(user_text)
        if income_value <= 0:
            await update.message.reply_text("Income must be greater than zero. Please enter a valid amount:")
            return INCOME
        
        context.user_data["income"] = income_value
        await update.message.reply_text(
            f"Income: ${income_value:.2f}\n\n"
            "Now, what are your monthly expenses in USD? (just the number, e.g. 2000)"
        )
        return EXPENSES
    except ValueError:
        await update.message.reply_text("Please enter a valid number for your income:")
        return INCOME

async def expenses(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Store the expenses and ask for risk level."""
    user_text = update.message.text
    try:
        expenses_value = float(user_text)
        if expenses_value < 0:
            await update.message.reply_text("Expenses cannot be negative. Please enter a valid amount:")
            return EXPENSES
        
        context.user_data["expenses"] = expenses_value
        
        # Offer risk level options with a keyboard
        keyboard = [
            ["Low"],
            ["Medium"],
            ["Bro Danger"]
        ]
        reply_markup = ReplyKeyboardMarkup(keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            "What's your investment risk tolerance?",
            reply_markup=reply_markup
        )
        return RISK_LEVEL
    except ValueError:
        await update.message.reply_text("Please enter a valid number for your expenses:")
        return EXPENSES

async def risk_level(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Generate financial advice based on collected information."""
    risk_level_value = update.message.text
    if risk_level_value not in ["Low", "Medium", "Bro Danger"]:
        await update.message.reply_text("Please select a valid risk level from the options provided.")
        return RISK_LEVEL
    
    context.user_data["risk_level"] = risk_level_value
    
    # Call the API to get financial advice
    await update.message.reply_text("Generating your financial report... 🔄")
    
    try:
        request_data = {
            "income": context.user_data["income"],
            "expenses": context.user_data["expenses"],
            "risk_level": context.user_data["risk_level"]
        }
        
        response = requests.post(f"{API_BASE_URL}/generate-advice", json=request_data)
        
        if response.status_code == 200:
            report = response.json()
            
            # Format the response message
            message = format_financial_report(report)
            await update.message.reply_text(message)
        else:
            logger.error(f"API Error: {response.status_code} - {response.text}")
            await update.message.reply_text(
                "Sorry, I couldn't generate your financial advice. Please try again later."
            )
    except Exception as e:
        logger.error(f"Error generating financial advice: {str(e)}")
        await update.message.reply_text(
            "Sorry, there was an error generating your financial advice. Please try again."
        )
    
    # End conversation
    await update.message.reply_text(
        "Type /start to generate a new financial report."
    )
    return ConversationHandler.END

def format_financial_report(report):
    """Format the financial report for Telegram message"""
    # Format investments as a string
    investments_text = ", ".join([inv["name"] for inv in report["investments"]])
    
    # Create the formatted message
    message = (
        "💰 Savings Report:\n"
        f"- Monthly Income: ${report['income']:.2f}\n"
        f"- Monthly Expenses: ${report['expenses']:.2f}\n"
        f"- Savings: ${report['savings']:.2f} ({report['savings_percent']}% of Income)\n\n"
        
        "📊 Budget Breakdown:\n"
        f"- Essential Expenses (50%): ${report['essential_expenses']:.2f}\n"
        f"- Discretionary Spending (30%): ${report['discretionary_spending']:.2f}\n"
        f"- Savings & Investments (20%): ${report['savings_investments']:.2f}\n\n"
        
        f"📈 Investment Advice (Risk: {report['risk_level']}):\n"
        f"- Suggested investments: {investments_text}\n"
        f"- Why? {report['investment_rationale']}\n\n"
        
        f"💡 Pro Tip: {report['pro_tip']}"
    )
    
    return message

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancel and end the conversation."""
    await update.message.reply_text(
        "Financial planning canceled. Type /start to begin again."
    )
    return ConversationHandler.END

def main() -> None:
    """Run the bot."""
    # Create the Application
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    # Add conversation handler
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            INCOME: [MessageHandler(filters.TEXT & ~filters.COMMAND, income)],
            EXPENSES: [MessageHandler(filters.TEXT & ~filters.COMMAND, expenses)],
            RISK_LEVEL: [MessageHandler(filters.TEXT & ~filters.COMMAND, risk_level)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    application.add_handler(conv_handler)

    # Start the Bot
    application.run_polling()

if __name__ == '__main__':
    main()