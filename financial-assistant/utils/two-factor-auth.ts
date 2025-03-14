import { authenticator } from "otplib"
import QRCode from "qrcode"

/**
 * Two-Factor Authentication Service
 *
 * This utility handles generating and validating 2FA codes
 * using the Time-based One-Time Password (TOTP) algorithm.
 */

// Configure the authenticator
authenticator.options = {
  // 6-digit codes
  digits: 6,
  // 30-second period
  step: 30,
  // Use SHA-1 algorithm (compatible with most authenticator apps)
  algorithm: "sha1",
}

/**
 * Generate a new secret key for 2FA
 *
 * @returns A new secret key
 */
export function generateSecret() {
  return authenticator.generateSecret()
}

/**
 * Generate a QR code for setting up 2FA in authenticator apps
 *
 * @param username - The user's email or username
 * @param secret - The 2FA secret key
 * @returns A data URL containing the QR code image
 */
export async function generateQRCode(username: string, secret: string) {
  try {
    // Create an otpauth URL (standard format for 2FA)
    const otpauthUrl = authenticator.keyuri(username, "MoneyMinder", secret)

    // Generate a QR code as a data URL
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)
    return qrCodeUrl
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

/**
 * Generate a one-time code for a user
 *
 * @param secret - The user's 2FA secret key
 * @returns A 6-digit code
 */
export function generateCode(secret: string) {
  return authenticator.generate(secret)
}

/**
 * Verify a 2FA code provided by the user
 *
 * @param token - The code provided by the user
 * @param secret - The user's 2FA secret key
 * @returns Whether the code is valid
 */
export function verifyCode(token: string, secret: string) {
  try {
    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error("Error verifying 2FA code:", error)
    return false
  }
}

/**
 * Generate a backup code for 2FA recovery
 *
 * @returns A random 10-character backup code
 */
export function generateBackupCode() {
  // Generate a random string of letters and numbers
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let backupCode = ""

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    backupCode += characters.charAt(randomIndex)
  }

  // Format as XXXXX-XXXXX for readability
  return `${backupCode.slice(0, 5)}-${backupCode.slice(5, 10)}`
}

