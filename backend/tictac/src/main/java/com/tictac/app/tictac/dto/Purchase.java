package com.tictac.app.tictac.dto;

import com.tictac.app.tictac.entities.Address;
import com.tictac.app.tictac.entities.Customer;
import com.tictac.app.tictac.entities.Order;
import com.tictac.app.tictac.entities.OrderItem;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
