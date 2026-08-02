describe('Login flow', () => {
  it('logs in and redirects to the dashboard', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('admin@crm.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('button', 'Sign In').click();

    cy.url().should('include', '/dashboard');
  });
});
