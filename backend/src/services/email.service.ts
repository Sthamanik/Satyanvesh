import { sendEmail } from "@utils/email.util.js";
import {
  welcomeEmailTemplate,
  hearingReminderTemplate,
  caseStatusUpdateTemplate,
  passwordResetTemplate,
  documentUploadedTemplate,
} from "@utils/emailTemplates.util.js";

class EmailService {
  // Send welcome email
  async sendWelcomeEmail(email: string, fullName: string, username: string) {
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Judiciary Transparency System",
        html: welcomeEmailTemplate(fullName, username),
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  }

  // Send hearing reminder
  async sendHearingReminder(
    email: string,
    fullName: string,
    caseNumber: string,
    caseTitle: string,
    hearingDate: Date,
    hearingTime: string,
    courtName: string,
    courtRoom?: string
  ) {
    try {
      await sendEmail({
        to: email,
        subject: `Hearing Reminder: ${caseNumber} on ${hearingDate.toLocaleDateString()}`,
        html: hearingReminderTemplate(
          fullName,
          caseNumber,
          caseTitle,
          hearingDate,
          hearingTime,
          courtName,
          courtRoom
        ),
      });
    } catch (error) {
      console.error("Failed to send hearing reminder:", error);
    }
  }

  // Send case status update
  async sendCaseStatusUpdate(
    email: string,
    fullName: string,
    caseNumber: string,
    caseTitle: string,
    oldStatus: string,
    newStatus: string
  ) {
    try {
      await sendEmail({
        to: email,
        subject: `Case Status Updated: ${caseNumber}`,
        html: caseStatusUpdateTemplate(
          fullName,
          caseNumber,
          caseTitle,
          oldStatus,
          newStatus
        ),
      });
    } catch (error) {
      console.error("Failed to send case status update:", error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(
    email: string,
    fullName: string,
    resetToken: string
  ) {
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html: passwordResetTemplate(fullName, resetToken),
      });
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    }
  }

  // Send document uploaded notification
  async sendDocumentUploadedNotification(
    email: string,
    fullName: string,
    caseNumber: string,
    caseTitle: string,
    documentTitle: string,
    documentType: string,
    uploadedBy: string
  ) {
    try {
      await sendEmail({
        to: email,
        subject: `New Document Uploaded: ${caseNumber}`,
        html: documentUploadedTemplate(
          fullName,
          caseNumber,
          caseTitle,
          documentTitle,
          documentType,
          uploadedBy
        ),
      });
    } catch (error) {
      console.error("Failed to send document uploaded notification:", error);
    }
  }

  // Send bulk emails (for notifications to multiple users)
  async sendBulkEmails(emails: string[], subject: string, html: string) {
    try {
      await sendEmail({
        to: emails,
        subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
    }
  }
}

export default new EmailService();
