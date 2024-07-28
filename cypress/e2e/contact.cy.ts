it('Contact Use Page', () => {
  cy.visit('http://localhost:4321/contact');
  cy.get('#name').type('TestUser');
  cy.get('#phone').type('1011011011');
  cy.get('#email').type('testuser@example.com');
  cy.get('#message').type('Test Message');
  cy.get('#submit').click();
  cy.contains('Thank you for your message! We will get back to you soon.').should('be.visible');
});
