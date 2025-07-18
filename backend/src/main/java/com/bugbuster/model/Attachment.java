package com.bugbuster.model;

import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attachment implements Serializable {
    private String filename;
    private String originalName;
    private long size;
    private Date uploadedAt;
}
