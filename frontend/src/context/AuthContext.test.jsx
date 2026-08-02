import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

function TestConsumer() {
  const { user, token, isLoading } = useAuth();

  return (
    <div>
      <div>{`user:${user ? user.email : 'null'}`}</div>
      <div>{`token:${token || 'null'}`}</div>
      <div>{`loading:${String(isLoading)}`}</div>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty auth state and finishes loading', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByText('user:null')).toBeTruthy();
    expect(screen.getByText('token:null')).toBeTruthy();
    expect(await screen.findByText('loading:false')).toBeTruthy();
  });
});
