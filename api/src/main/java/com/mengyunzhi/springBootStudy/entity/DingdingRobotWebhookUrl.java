package com.mengyunzhi.springBootStudy.entity;

import javax.persistence.*;

@Entity
public class DingdingRobotWebhookUrl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String webhookUrl;

    public void setWebhookUrl(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getWebhookUrl() {
        return webhookUrl;
    }
}
