it('Contact Use Page', () => {
  cy.get('#name').type('TestUser');
  cy.get('#number').type('1011011011');
  cy.get('#email').type('testuser@example.com');
  cy.get('#message').type('Test Message');
  cy.get('#submit').click();
  cy.contains('Messagese sent').should('be.visible');
});
