import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeesTable from '../EmployeesTable';

const mockEmployees = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    hire_date: '2023-01-01',
    is_supervisor: true,
    is_administrator: false,
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    hire_date: '2022-12-12',
    is_supervisor: false,
    is_administrator: true,
  },
];

describe('EmployeesTable', () => {
  test('renders employee rows', () => {
    render(<EmployeesTable employees={mockEmployees} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
  });

  test('renders buttons and responds to clicks', () => {
    global.window = { location: { href: '' } }; // mock window.location
    render(<EmployeesTable employees={mockEmployees} />);

    const addBtn = screen.getByText(/add new employee/i);
    fireEvent.click(addBtn);
    expect(window.location.href).toMatch(/employees\/new/);
  });

  test('filters by supervisor role', () => {
    render(<EmployeesTable employees={mockEmployees} />);
    const supervisorBtn = screen.getByText(/view supervisors/i);
    fireEvent.click(supervisorBtn);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('sorts A-Z', () => {
    render(<EmployeesTable employees={mockEmployees} />);
    fireEvent.change(screen.getByLabelText(/sort/i), { target: { value: 'name-asc' } });
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Jane Smith');
    expect(rows[2]).toHaveTextContent('John Doe');
  });

  test('shows no employees if list is empty', () => {
    render(<EmployeesTable employees={[]} />);
    expect(screen.getByText(/no employees to display/i)).toBeInTheDocument();
  });
});
