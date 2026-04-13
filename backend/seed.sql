INSERT INTO users (id, name, email, password)
VALUES (
  gen_random_uuid(),
  'Test User',
  'test@example.com',
  '$2a$12$zSDhTRb8QVpB4Ocf.DPFq.DC/9rDHXZbU0XNvhkXY.PpCkuDGqI1q' -- bcrypt hash of password123
);  