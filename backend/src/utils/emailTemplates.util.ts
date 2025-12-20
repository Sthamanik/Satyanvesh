export const welcomeEmailTemplate = (fullName: string, username: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Judiciary System</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Judiciary Transparency System!</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Thank you for registering with our Judiciary Transparency System. Your account has been successfully created.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p>You can now access public case information, bookmark cases, and track hearings.</p>
          <a href="${
            process.env.FRONTEND_URL
          }/login" class="button">Login to Your Account</a>
          <p style="margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Judiciary Transparency System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Hearing reminder email template
export const hearingReminderTemplate = (
  fullName: string,
  caseNumber: string,
  caseTitle: string,
  hearingDate: Date,
  hearingTime: string,
  courtName: string,
  courtRoom?: string
) => {
  const formattedDate = hearingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hearing Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-left: 4px solid #f5576c; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚖️ Hearing Reminder</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>This is a reminder about your upcoming court hearing:</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">Case Number:</span> ${caseNumber}
            </div>
            <div class="info-row">
              <span class="label">Case Title:</span> ${caseTitle}
            </div>
            <div class="info-row">
              <span class="label">Date:</span> ${formattedDate}
            </div>
            <div class="info-row">
              <span class="label">Time:</span> ${hearingTime}
            </div>
            <div class="info-row">
              <span class="label">Court:</span> ${courtName}
            </div>
            ${
              courtRoom
                ? `<div class="info-row"><span class="label">Court Room:</span> ${courtRoom}</div>`
                : ""
            }
          </div>

          <p><strong>Please arrive 15 minutes before the scheduled time.</strong></p>
          <a href="${
            process.env.FRONTEND_URL
          }/cases/${caseNumber}" class="button">View Case Details</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Judiciary Transparency System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Case status update email template
export const caseStatusUpdateTemplate = (
  fullName: string,
  caseNumber: string,
  caseTitle: string,
  oldStatus: string,
  newStatus: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Case Status Updated</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .status { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin: 5px; }
        .old-status { background: #ffebee; color: #c62828; }
        .new-status { background: #e8f5e9; color: #2e7d32; }
        .arrow { font-size: 24px; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background: #4facfe; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Case Status Updated</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>The status of your case has been updated:</p>
          
          <div style="margin: 20px 0;">
            <p><strong>Case Number:</strong> ${caseNumber}</p>
            <p><strong>Case Title:</strong> ${caseTitle}</p>
          </div>

          <div class="status-box">
            <span class="status old-status">${oldStatus.toUpperCase()}</span>
            <span class="arrow">→</span>
            <span class="status new-status">${newStatus.toUpperCase()}</span>
          </div>

          <p>You can view the complete case details by clicking the button below.</p>
          <a href="${
            process.env.FRONTEND_URL
          }/cases/${caseNumber}" class="button">View Case Details</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Judiciary Transparency System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password reset email template
export const passwordResetTemplate = (fullName: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #fa709a; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>You have requested to reset your password. Click the button below to set a new password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>

          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will not change until you access the link and create a new one</li>
            </ul>
          </div>

          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Judiciary Transparency System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Document uploaded notification template
export const documentUploadedTemplate = (
  fullName: string,
  caseNumber: string,
  caseTitle: string,
  documentTitle: string,
  documentType: string,
  uploadedBy: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Document Uploaded</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .doc-box { background: white; padding: 20px; border-left: 4px solid #a8edea; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #a8edea; color: #333; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 New Document Uploaded</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>A new document has been uploaded to your case:</p>
          
          <div class="doc-box">
            <p><strong>Case:</strong> ${caseNumber} - ${caseTitle}</p>
            <p><strong>Document:</strong> ${documentTitle}</p>
            <p><strong>Type:</strong> ${documentType}</p>
            <p><strong>Uploaded By:</strong> ${uploadedBy}</p>
          </div>

          <a href="${
            process.env.FRONTEND_URL
          }/cases/${caseNumber}/documents" class="button">View Documents</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Judiciary Transparency System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
