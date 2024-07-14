const randomEmail = Math.random().toString(36).substring(7) + '@example.com';
it('Should create an account', () => {
  cy.visit('http://localhost:4321/auth/signup');
  cy.get('#name').type('Test User');
  cy.get('#email').type(randomEmail);
  cy.get('#password').type('S3cure@password');
  cy.get('#confirm').type('S3cure@password');
  cy.get('#submit').click();
  // cy.contains('Account create successfully').should('be.visible');
  cy.url().should('eq', Cypress.config().baseUrl);
});
it('Should Sign in', () => {
  cy.visit('http://localhost:4321/auth/signin');
  cy.get('#email').type(randomEmail);
  cy.get('#password').type('S3cure@password');
  cy.get('#submit').click();
  cy.contains('Sign in successful').should('be.visible');
  cy.url().should('eq', Cypress.config().baseUrl);
  cy.get('#sign-out').should('be.visible');
});
it('Should Fail To sign in', () => {
  cy.visit('http://localhost:4321/auth/signin');
  cy.get('#email').type("invaliduser@example.com");
  cy.get('#password').type('password');
  cy.get('#submit').click();
  cy.url().should('include', '/auth/signin');
  cy.contains('Invalid email or password').should('be.visible');
});

