package com.mengyunzhi.springBootStudy.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 课程
 * @author panjie
 */
@Entity
@EntityListeners(CourseListener.class)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false)
    private String name = "";

    @Column(nullable = false)
    private Long sory;
    @ElementCollection
    @CollectionTable(name = "course_day", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "day")
    private List<Integer> day = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "course_week", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "week")
    private List<Integer> week = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "course_period", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "period")
    private List<Integer> period = new ArrayList<>();

    @ManyToOne
    private Term term;

    @ManyToMany
    private List<User> users = new ArrayList<>();

    public Long getSory() {
        return sory;
    }

    public void setSory(Long sory) {
        this.sory = sory;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Term getTerm() {
        return term;
    }

    public void setTerm(Term term) {
        this.term = term;
    }

    public List<User> getUsers() { return users; }

    public void setUsers(List<User> users) { this.users = users; }

    public List<Integer> getDay() { return day; }

    public void setDay(List<Integer> day) { this.day = day; }

    public List<Integer> getWeek() { return week; }

    public void setWeek(List<Integer> week) { this.week = week; }

    public List<Integer> getPeriod() { return period; }

    public void setPeriod(List<Integer> period) { this.period = period; }
}