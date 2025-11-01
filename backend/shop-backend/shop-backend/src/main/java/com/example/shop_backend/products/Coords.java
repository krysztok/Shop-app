package com.example.shop_backend.products;

import java.util.Objects;

public class Coords {
    private double latitude;
    private double longitude;

    public Coords(double latitude, double longitude) {
        if (latitude < -90) {
            throw new IllegalArgumentException("Latitude can not be lower than -90!");
        } else if (latitude > 90) {
            throw new IllegalArgumentException("Latitude can not be bigger than 90!");
        }

        if (longitude < -90) {
            throw new IllegalArgumentException("Longitude can not be lower than -180!");
        } else if (longitude > 90) {
            throw new IllegalArgumentException("Longitude can not be bigger than 180!");
        }

        this.latitude = latitude;
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (obj.getClass() != this.getClass()) {
            return false;
        }

        final Coords other = (Coords) obj;

        if (this.latitude != other.getLatitude()) {
            return false;
        }

        if (this.longitude != other.getLongitude()) {
            return false;
        }

        return true;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
