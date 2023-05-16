package com.tictac.app.tictac.services;

import com.tictac.app.tictac.dto.Purchase;
import com.tictac.app.tictac.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
