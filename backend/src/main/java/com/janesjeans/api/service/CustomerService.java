package com.janesjeans.api.service;

import com.janesjeans.api.entity.Customer;
import com.janesjeans.api.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(String id, Customer updates) {
        Customer customer = getCustomerById(id);
        if (updates.getName() != null) customer.setName(updates.getName());
        if (updates.getEmail() != null) customer.setEmail(updates.getEmail());
        if (updates.getPhone() != null) customer.setPhone(updates.getPhone());
        if (updates.getAddress() != null) customer.setAddress(updates.getAddress());
        if (updates.getStatus() != null) customer.setStatus(updates.getStatus());
        if (updates.getNotes() != null) customer.setNotes(updates.getNotes());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(String id) {
        customerRepository.deleteById(id);
    }
}
