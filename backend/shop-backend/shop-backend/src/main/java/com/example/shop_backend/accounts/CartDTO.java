package com.example.shop_backend.accounts;

public class CartDTO {
    private String[] ids;
    private int[] amount;

    public CartDTO(String[] ids, int[] amount) {
        if(ids.length != amount.length) {
            throw new IllegalArgumentException("Ids and Amount lengths must be equal!");
        }

        for (int i : amount) {
            if (i <= 0) {
                throw new IllegalArgumentException("Amount cannot be lower or equal 0!");
            }
        }

        for (String id : ids) {
            if (!id.matches("^[0-9a-zA-Z ()']+$")) {
                throw new IllegalArgumentException("Ids contain illegal characters!");
            } else if (id.length() > 25){
                throw new IllegalArgumentException("Ids too long!");
            }
        }

        this.ids = ids;
        this.amount = amount;
    }

    public String[] getIds() {
        return ids;
    }

    public void setIds(String[] ids) {
        this.ids = ids;
    }

    public int[] getAmount() {
        return amount;
    }

    public void setAmount(int[] amount) {
        this.amount = amount;
    }
}
