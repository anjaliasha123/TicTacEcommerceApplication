package com.tictac.app.tictac.repositories;

import com.tictac.app.tictac.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String theEmail);
}
