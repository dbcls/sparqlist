describe('listing sparqlets', () => {
  it('ok', () => {
    cy.visit('/');
    cy.get('.navbar-brand').contains('SPARQList');
  });
});
