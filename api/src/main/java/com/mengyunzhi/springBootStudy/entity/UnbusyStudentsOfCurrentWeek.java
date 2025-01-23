package com.mengyunzhi.springBootStudy.entity;

public class UnbusyStudentsOfCurrentWeek {
    private String time;
    private User user;

    public UnbusyStudentsOfCurrentWeek(User user, String time) {
        this.time = time;
        this.user = user;
    }
    public void setTime(String time) {
        this.time = time;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTime() {
        return time;
    }

    public User getUser() {
        return user;
    }
}
