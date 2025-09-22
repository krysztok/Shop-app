package com.example.shop_backend.products;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document()
public class Rating {
    @Id
    @Indexed(unique=true)
    private String _id;
    private String user;
    private double value;
    private String comment;
    private Date date;

    public Rating(String user, double value, String comment) {
        this.user = user;
        this.value = value;
        this.comment = comment;

        if (user == null || user.isEmpty()) {
            throw new IllegalArgumentException("User cannot be empty!");
        }
        else if (user.length() > 40) {
            throw new IllegalArgumentException("User is too long!");
        }
        else if (!user.matches("^[0-9a-zA-Z ]+$")){
            throw new IllegalArgumentException("User contains illegal characters!");
        }

        if (comment == null || comment.isEmpty()) {
            throw new IllegalArgumentException("Comment can not be empty!");
        } else if(comment.length() > 500) {
            throw new IllegalArgumentException("Comment is too long!");
        } else if (!comment.matches("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")){
            throw new IllegalArgumentException("Comment contains illegal characters!");
        }

        if (value < 1) {
            throw new IllegalArgumentException("Value can not be lower than 1!");
        } else if (value > 5) {
            throw new IllegalArgumentException("Value can not be higher than 5!");
        }

    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }
}
