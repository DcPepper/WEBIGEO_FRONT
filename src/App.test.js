import { render, screen } from '@testing-library/react';
import Menu2 from './components/Menu2';
import { MemoryRouter as Router } from "react-router-dom";

test('renders learn react link', () => {
  render(<Router>
    <Menu2 />
  </Router>
  );
  const linkElement = screen.getByText(/HOME/i);
  expect(linkElement).toBeInTheDocument();
});
