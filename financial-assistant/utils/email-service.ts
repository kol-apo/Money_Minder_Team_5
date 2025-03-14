import nodemailer from "nodemailer"

/**
 * Email Service
 *
 * This utility handles sending emails for account verification,
 * password resets, and two-factor authentication.
 */

// Create a transporter using SMTP settings from environment variables
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Send a verification email to a new user
 *
 * @param to - Recipient email address
 * @param name - Recipient's name
 * @param verificationToken - The token for email verification
 */
export async function sendVerificationEmail(to: string, name: string, verificationToken: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verificationUrl = `${appUrl}/verify-email?token=${verificationToken}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"MoneyMinder" <noreply@moneyminder.com>',
    to,
    subject: "Verify Your MoneyMinder Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Welcome to MoneyMinder!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with MoneyMinder. To complete your registration, please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The MoneyMinder Team</p>
      </div>
    `,
  }

  try {
    await emailTransporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending verification email:", error)
    return { success: false, error }
  }
}

/**
 * Send a two-factor authentication code
 *
 * @param to - Recipient email address
 * @param name - Recipient's name
 * @param code - The 2FA code
 */
export async function sendTwoFactorCode(to: string, name: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"MoneyMinder" <noreply@moneyminder.com>',
    to,
    subject: "Your MoneyMinder Login Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">MoneyMinder Security Code</h2>
        <p>Hi ${name},</p>
        <p>Your security code for logging into MoneyMinder is:</p>
        <p style="font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 30px 0; padding: 10px; background-color: #f3f4f6; border-radius: 5px;">${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please secure your account by changing your password immediately.</p>
        <p>Best regards,<br>The MoneyMinder Team</p>
      </div>
    `,
  }

  try {
    await emailTransporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending 2FA code:", error)
    return { success: false, error }
  }
}

/**
 * Send a password reset email
 *
 * @param to - Recipient email address
 * @param name - Recipient's name
 * @param resetToken - The token for password reset
 */
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"MoneyMinder" <noreply@moneyminder.com>',
    to,
    subject: "Reset Your MoneyMinder Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">MoneyMinder Password Reset</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your MoneyMinder password. Click the button below to create a new password:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The MoneyMinder Team</p>
      </div>
    `,
  }

  try {
    await emailTransporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error }
  }
}

