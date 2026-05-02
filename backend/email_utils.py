import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_alert_email(target_email, coin, alert_message, predicted_price):
    # Get SMTP credentials from .env
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")

    if not EMAIL_USER or not EMAIL_PASS:
        print("SMTP Credentials missing. Skipping email.")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = target_email
        msg['Subject'] = f"CryptoPredict Alert: {coin} Signal"

        body = f"""
        <html>
        <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb;">CryptoPredict AI Analysis</h2>
                <p>Hello,</p>
                <p>Our AI model has just analyzed <strong>{coin}</strong> and generated a new market signal:</p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
                    <p style="margin: 0; font-size: 18px;"><strong>Signal:</strong> {alert_message}</p>
                    <p style="margin: 5px 0 0 0; font-size: 16px;"><strong>Target Price:</strong> ${predicted_price}</p>
                </div>
                <p>Login to your dashboard to see the full market analysis and technical indicators.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #94a3b8;">This is an automated alert from your CryptoPredict account. You can manage notification settings in your dashboard.</p>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()
        print(f"Email alert sent to {target_email} for {coin}")
        return True
    except Exception as e:
        print(f"Failed to send email alert: {e}")
        return False
