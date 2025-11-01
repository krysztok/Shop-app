package com.example.shop_backend.products;

import java.time.LocalTime;

public class ShopHours {
    private LocalTime from;
    private LocalTime to;

    public ShopHours(LocalTime from, LocalTime to) {
        //can be after midnight??
        /*if (!from.isBefore(to)) {
            throw new IllegalArgumentException("Opening time can not be after closing time!");
        }*/

        this.from = from;
        this.to = to;
    }

    public LocalTime getFrom() {
        return from;
    }

    public void setFrom(LocalTime from) {
        this.from = from;
    }

    public LocalTime getTo() {
        return to;
    }

    public void setTo(LocalTime to) {
        this.to = to;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (obj.getClass() != this.getClass()) {
            return false;
        }

        final ShopHours other = (ShopHours) obj;

        if(this.from == null && other.from != null) {
            return false;
        }

        if(this.to == null && other.to != null) {
            return false;
        }


        if (this.from!=null && !this.from.equals(other.getFrom())) {
            return false;
        }

        if (this.to!=null && !this.to.equals(other.getTo())) {
            return false;
        }

        return true;
    }
}
