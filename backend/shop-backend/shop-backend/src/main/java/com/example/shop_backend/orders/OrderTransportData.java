package com.example.shop_backend.orders;

public class OrderTransportData {
    private String transportType;
    private double transportCost;

    public OrderTransportData(){}

    public OrderTransportData(String transportType, double transportCost) {
        System.out.println("?");
        this.transportType = transportType;

        boolean correctTransportOptions = false;
        String[] transportOptions = {"Transport option 1", "Transport option 2", "Transport option 3", "Transport option 4", "Transport option 5", "Transport option 6", "Self-pickup"};
        double[] transportCosts = {5, 10, 10.99, 11, 13, 15, 0};

        for (int i = 0; i < transportOptions.length; i++) {
            if(transportType.equals(transportOptions[i])){
                correctTransportOptions = true;


                if(transportCost != transportCosts[i]){
                    throw new IllegalArgumentException("Incorrect transport cost!");
                }

                this.transportCost = transportCosts[i];
                break;
            }
        }

        if(!correctTransportOptions) {
            throw new IllegalArgumentException("Incorrect transport option!");
        }
    }

    public String getTransportType() {
        return transportType;
    }

    public void setTransportType(String transportType) {
        this.transportType = transportType;
    }

    public double getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(double transportCost) {
        this.transportCost = transportCost;
    }
}
