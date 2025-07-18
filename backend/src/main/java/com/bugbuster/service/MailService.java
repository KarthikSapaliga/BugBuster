package com.bugbuster.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBugAssignmentMail(String toEmail, String bugTitle) {
        String subject = "Bug Assignment Notification";
        String body = "You have been assigned a new bug:\n\nTitle: " + bugTitle +
                "\n\nPlease check your dashboard for details.";

        sendSimpleMail(toEmail, subject, body);
    }

    public void sendWorkRequestApprovalMail(String toEmail, String bugTitle) {
        String subject = "Work Request Approved";
        String body = "Your request to work on the bug titled '" + bugTitle +
                "' has been approved by the tester. You can now begin work.";

        sendSimpleMail(toEmail, subject, body);
    }

    private void sendSimpleMail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your_email@gmail.com");
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send mail: " + e.getMessage());
        }
    }
}
