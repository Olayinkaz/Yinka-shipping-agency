-- Sample data for development and testing
-- Run this after creating the tables

-- Insert sample admin user (password: admin123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@shippingagency.com', '$2b$10$rOzJqQZ8kVxwXqJ5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5', 'Admin', 'User', 'admin');

-- Insert sample customer user (password: customer123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'customer@example.com', '$2b$10$rOzJqQZ8kVxwXqJ5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5N5', 'John', 'Doe', 'customer');

-- Insert sample customer details
INSERT INTO customers (id, user_id, company_name, address_line1, city, state, postal_code) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Acme Corp', '123 Business St', 'New York', 'NY', '10001');

-- Insert sample shipment
INSERT INTO shipments (
    id, tracking_number, customer_id,
    sender_name, sender_address_line1, sender_city, sender_state, sender_postal_code,
    recipient_name, recipient_address_line1, recipient_city, recipient_state, recipient_postal_code,
    weight, service_type, status, shipping_cost, total_cost
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'SA123456789',
    '550e8400-e29b-41d4-a716-446655440002',
    'John Doe',
    '123 Business St',
    'New York',
    'NY',
    '10001',
    'Jane Smith',
    '456 Residential Ave',
    'Los Angeles',
    'CA',
    '90210',
    5.5,
    'express',
    'in_transit',
    25.99,
    25.99
);

-- Insert sample tracking events
INSERT INTO tracking_events (shipment_id, status, description, location) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'picked_up', 'Package picked up from sender', 'New York, NY'),
('550e8400-e29b-41d4-a716-446655440003', 'in_transit', 'Package in transit to destination', 'Chicago, IL');
