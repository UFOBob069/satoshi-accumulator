module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',    // Allow 'any' type
    'react/no-unescaped-entities': 'off',           // Allow unescaped apostrophes
  },
}; 