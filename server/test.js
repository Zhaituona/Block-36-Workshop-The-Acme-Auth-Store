const { createUser, createProduct, fetchUsers, fetchProducts } = require('./db');
const pg = require('pg');

// Mock the pg Client
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn()
  };
  return { Client: jest.fn(() => mClient) };
});

const mockClient = new pg.Client();

describe('Database Methods with Mock Data', () => {
  beforeEach(() => {
    // Clear previous mock calls
    mockClient.query.mockClear();
  });

  test('createUser should create a new user', async () => {
    const mockUser = {
      id: 'mock-id',
      username: 'test_user',
      password: 'hashed_password'
    };

    // Mocking the query response for user creation
    mockClient.query.mockResolvedValueOnce({ rows: [mockUser] });

    const user = await createUser({ username: 'test_user', password: 'test_password' });

    // Assertions
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.any(Array)
    );
    expect(user).toHaveProperty('id', 'mock-id');
    expect(user).toHaveProperty('username', 'test_user');
  });

  test('createProduct should create a new product', async () => {
    const mockProduct = {
      id: 'mock-product-id',
      name: 'test_product'
    };

    // Mocking the query response for product creation
    mockClient.query.mockResolvedValueOnce({ rows: [mockProduct] });

    const product = await createProduct({ name: 'test_product' });

    // Assertions
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO products'),
      expect.any(Array)
    );
    expect(product).toHaveProperty('id', 'mock-product-id');
    expect(product).toHaveProperty('name', 'test_product');
  });

  test('fetchUsers should return a list of users', async () => {
    const mockUsers = [
      { id: 'mock-id-1', username: 'user1' },
      { id: 'mock-id-2', username: 'user2' }
    ];

    // Mocking the query response for fetching users
    mockClient.query.mockResolvedValueOnce({ rows: mockUsers });

    const users = await fetchUsers();

    // Assertions
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('SELECT id, username FROM users;'));
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0]).toHaveProperty('username', 'user1');
  });

  test('fetchProducts should return a list of products', async () => {
    const mockProducts = [
      { id: 'mock-product-id-1', name: 'product1' },
      { id: 'mock-product-id-2', name: 'product2' }
    ];

    // Mocking the query response for fetching products
    mockClient.query.mockResolvedValueOnce({ rows: mockProducts });

    const products = await fetchProducts();

    // Assertions
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM products;'));
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(2);
    expect(products[0]).toHaveProperty('name', 'product1');
  });
});
