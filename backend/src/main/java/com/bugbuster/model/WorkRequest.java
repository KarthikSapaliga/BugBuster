package com.bugbuster.model;

import java.util.Date;

public class WorkRequest {
    private String author; // email or user id
    private String content;
    private String status; // pending, approved, rejected
    private Date timestamp;

    // Getters and setters
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}