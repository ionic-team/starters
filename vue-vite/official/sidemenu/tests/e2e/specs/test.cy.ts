describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/folder/Inbox')
    cy.contains('#container', 'Inbox')
  })
})
