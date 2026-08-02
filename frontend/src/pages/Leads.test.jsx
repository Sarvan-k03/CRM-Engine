import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Leads from './Leads';

const { mockGet, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('../services/api', () => ({
  default: {
    get: mockGet,
    put: mockPut,
    delete: mockDelete,
  },
}));

describe('Leads', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({ data: { data: [{ _id: '1', name: 'Alicia', email: 'alicia@example.com', status: 'New', createdAt: '2024-01-01T00:00:00.000Z' }] } });
    mockPut.mockResolvedValue({ data: { data: { _id: '1', name: 'Alicia', email: 'alicia@example.com', status: 'Contacted', createdAt: '2024-01-01T00:00:00.000Z' } } });
    mockDelete.mockResolvedValue({});
    window.confirm = vi.fn(() => true);
  });

  it('updates the status locally immediately when the quick status change is used', async () => {
    render(<Leads />);

    expect(await screen.findByText('Alicia')).toBeTruthy();

    const select = screen.getByDisplayValue('New');
    fireEvent.change(select, { target: { value: 'Contacted' } });

    expect(screen.getByText('Contacted')).toBeTruthy();
    expect(mockPut).toHaveBeenCalledWith('/leads/1', { status: 'Contacted' });
  });
});
