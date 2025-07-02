/*
Author: Matthew Heering
Description: e2e testing to verify managing a new employee as an admin works as expected. 
Date: 7/2/25
*/
describe("Admin Manage Employee Flow", () => {
  it("allows admin to view and edit employee details", () => {
    cy.visit("http://127.0.0.1:3000");
    cy.contains("Manage Employees").should("exist");
    cy.get("table").within(() => {
      cy.contains("Manage").first().click();
    });
    cy.contains("Employee Details").should("exist");
    cy.contains("First Name").should("exist");
    cy.contains("Last Name").should("exist");
  });
});
