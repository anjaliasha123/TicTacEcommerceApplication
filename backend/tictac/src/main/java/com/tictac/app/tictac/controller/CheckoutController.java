package com.tictac.app.tictac.controller;

import com.tictac.app.tictac.dto.Purchase;
import com.tictac.app.tictac.dto.PurchaseResponse;
import com.tictac.app.tictac.services.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin("http://localhost:4200")
public class CheckoutController {
    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }
}
