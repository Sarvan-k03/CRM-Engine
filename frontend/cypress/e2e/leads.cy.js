describe('Leads flow', () => {
  it('adds a lead and shows it in the table', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('admin@crm.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('button', 'Sign In').click();

    cy.url().should('include', '/dashboard');
    cy.visit('/leads');

    cy.contains('button', 'Add Lead').click();

    cy.get('input[name="name"]').type('Cypress Test Lead');
    cy.get('input[name="email"]').type('cypress@example.com');
    cy.get('input[name="phone"]').type('555-0000');
    cy.get('select[name="status"]').select('Contacted');
    cy.contains('button', 'Add Lead').click();

    cy.contains('Cypress Test Lead').should('be.visible');
  });
});
