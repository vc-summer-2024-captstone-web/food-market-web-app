it('Should create an account', () => {
  cy.visit('http://localhost:4321/auth/signup');
  cy.get('#name').type('Test User');
  cy.get('#email').type('testuser@example.com');
  cy.get('#password').type('S3cure@password');
  cy.get('#confirm').type('S3cure@password');
  cy.get('#submit').click();
  cy.url().should('include', '/');
  // cy.contains('Account create successfully').should('be.visible');
});
// it('Should Sign out of account'), () => {
//   cy.get('#sign-out').click();
  
// }
it('Should Signin', () => {
  cy.visit('http://localhost:4321/auth/signin');
  cy.get('#email').type('testuser@example.com');
  cy.get('#password').type('S3cure@password');
  cy.get('#submit').click();
  cy.url().should('include', '/');
  cy.get('#sign-out').should('be.visible');
});
it('Invalid Login', () => {
  cy.visit('http://localhost:4321');
  cy.get('#email').type('invaliduser@example.com');
  cy.get('#password').type('wrongpassword');
  cy.get('#login').click();
  // cy.contains('Invalid username or password').should('be.visible');
});

