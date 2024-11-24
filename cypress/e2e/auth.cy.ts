const randomEmail = Math.random().toString(36).substring(7) + '@example.com';
it('Should create an account', () => {
  cy.visit('http://localhost:4321/auth/signup');
  cy.get('#name').focus().type('Test User');
  cy.get('#email').focus().type(randomEmail);
  cy.get('#password').focus().type('S3cure@password');
  cy.get('#confirm').focus().type('S3cure@password');
  cy.get('#submit').click();
  // cy.contains('Account create successfully').should('be.visible');
  cy.url().should('eq', Cypress.config().baseUrl);
});
it('Should Sign in', () => {
  cy.visit('http://localhost:4321/auth/signin');
  cy.get('#email').focus().type(randomEmail);
  cy.get('#password').focus().type('S3cure@password');
  cy.get('#submit').click();
  cy.contains('Sign in successful').should('be.visible');
  cy.url().should('eq', Cypress.config().baseUrl);
  cy.get('#sign-out').should('be.visible');
});
it('Should Fail To sign in', () => {
  cy.visit('http://localhost:4321/auth/signin');
  cy.get('#email').focus().type('invaliduser@example.com');
  cy.get('#password').focus().type('password');
  cy.get('#submit').click();
  cy.url().should('include', '/auth/signin');
  cy.contains('Invalid email or password').should('be.visible');
});
