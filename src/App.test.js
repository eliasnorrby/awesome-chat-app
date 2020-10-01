import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders sign in link', async () => {
  const { findByText } = render(<App />);
  expect(await findByText(/sign in with google/i)).toBeInTheDocument();
});
