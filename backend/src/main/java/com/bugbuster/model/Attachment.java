package com.bugbuster.model;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attachment implements Serializable {
    private String filename;
    private String originalName;
    private long size;
    private LocalDateTime uploadedAt;
    private String type;
}
