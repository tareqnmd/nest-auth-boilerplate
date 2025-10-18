import { APP_NAME } from '../../../common/constants';

interface WelcomeOtpTemplateParams {
  userName?: string;
  token: string;
  expiryMinutes: number;
  userId: string;
  clientUrl: string;
}

export const generateWelcomeOtpTemplate = ({
  userName,
  expiryMinutes,
  token,
  userId,
  clientUrl,
}: WelcomeOtpTemplateParams): string => {
  const greeting = userName ? `Hi ${userName}` : 'Hello';
  const verifyLink = `${clientUrl}/verify-user?userId=${userId}&token=${token}`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to ${APP_NAME}</title><style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f4f7fa;color:#333333}.email-container{max-width:600px;margin:0 auto;background-color:#ffffff}.header{background:linear-gradient(135deg,#00a76f 0%,#008f5d 100%);padding:20px 15px;text-align:center}.header h1{color:#ffffff;margin:0;font-size:24px;font-weight:600}.content{padding:20px 15px}.greeting{font-size:16px;color:#333333;margin-bottom:10px}.message{color:#334155;font-size:14px;line-height:1.5;margin-bottom:15px}.btn-container{text-align:center;margin:20px 0}.verify-btn{display:inline-block;padding:12px 30px;background-color:#00a76f;color:#ffffff!important;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px}.verify-btn:hover{background-color:#008f5d}.otp-section{text-align:center;margin:20px 0;padding:20px 15px;background-color:#fafafa;border-radius:8px}.otp-label{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;font-weight:600}.otp-code{font-size:32px;font-weight:700;color:#00a76f;letter-spacing:6px;padding:12px 20px;background-color:#ffffff;border:2px dashed #00a76f;border-radius:8px;display:inline-block;margin:8px 0}.expiry-notice{background-color:#fef3c7;border-left:4px solid #f59e0b;padding:10px 12px;margin:15px 0;border-radius:4px;font-size:13px;color:#78350f;line-height:1.4}.expiry-notice strong{color:#92400e}.footer{background-color:#f8fafc;padding:15px;text-align:center;border-top:1px solid #e2e8f0}.footer p{margin:5px 0;color:#64748b;font-size:12px}@media only screen and (max-width:480px){.header{padding:15px 10px}.header h1{font-size:20px}.content{padding:15px 10px}.verify-btn{padding:10px 24px;font-size:14px}.otp-code{font-size:28px;letter-spacing:4px;padding:10px 15px}.otp-section{padding:15px 10px;margin:15px 0}.expiry-notice{padding:8px 10px;font-size:12px}.footer{padding:12px}}</style></head><body><div class="email-container"><div class="header"><h1>Welcome to ${APP_NAME}!</h1></div><div class="content"><div class="greeting">${greeting},</div><div class="message">Your account has been created successfully. Please verify your email to get started.</div><div class="btn-container"><a href="${verifyLink}" class="verify-btn">Verify Email Address</a></div><div class="expiry-notice"><strong>⏰ Expires in ${expiryMinutes} minutes</strong> — Please verify your account before the code expires.</div></div><div class="footer"><p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p></div></div></body></html>`.trim();
};

export const generateWelcomeOtpPlainText = ({
  userName,
  token,
  expiryMinutes,
  userId,
  clientUrl,
}: WelcomeOtpTemplateParams): string => {
  const greeting = userName ? `Hi ${userName}` : 'Hello';
  const verifyLink = `${clientUrl}/verify-user?userId=${userId}&token=${token}`;

  return `
${greeting},

Your account has been created with ${APP_NAME}. Please verify your email to get started.

Click here to verify: ${verifyLink}

⏰ This code expires in ${expiryMinutes} minutes.

Best regards,
The ${APP_NAME} Team

---
© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
  `.trim();
};
