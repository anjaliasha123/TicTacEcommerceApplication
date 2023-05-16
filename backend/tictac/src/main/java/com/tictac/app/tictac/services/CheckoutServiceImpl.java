package com.tictac.app.tictac.services;

import com.tictac.app.tictac.dto.Purchase;
import com.tictac.app.tictac.dto.PurchaseResponse;
import com.tictac.app.tictac.entities.Customer;
import com.tictac.app.tictac.entities.Order;
import com.tictac.app.tictac.entities.OrderItem;
import com.tictac.app.tictac.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    @Autowired
    private CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository repo){
        this.customerRepository = repo;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        String orderTrackingNumber = this.generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        Customer customer = purchase.getCustomer();

        //check if existing customer
        String email = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(email);
        if(customerFromDB != null){
            customer = customerFromDB;
        }
        customer.add(order);
        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }
    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
