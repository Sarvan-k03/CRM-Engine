import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  it('renders the title, value, icon, and trend correctly', () => {
    render(<MetricCard title="Revenue" value="$12k" icon="💰" trend={12} />);

    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('$12k')).toBeTruthy();
    expect(screen.getByText('💰')).toBeTruthy();
    expect(screen.getByText('+12%')).toBeTruthy();
  });
});
