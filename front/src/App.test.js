import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Cyramik home hero', () => {
  render(<App />);
  expect(screen.getByText(/Specialty Coffee & Pottery Studio/i)).toBeInTheDocument();
});
