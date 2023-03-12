import { generateToken } from './token.module';

// const express = require('express');
// const dotenv = require('dotenv');
// const jwt = require('jsonwebtoken');
// const app = express();

describe('generateToken function', () => {
    test('returns a string', () => {
      const result = generateToken();
      expect(typeof result).toBe('string');
    });
  
    test('returns a different string on each call', () => {
      const result1 = generateToken();
      const result2 = generateToken();
      expect(result1).not.toBe(result2);
    });
});