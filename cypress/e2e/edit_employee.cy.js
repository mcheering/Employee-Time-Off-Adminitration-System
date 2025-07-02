/*
Author: Matthew Heering
Description: e2e testing to verify editing an employee works as expected. 
Date: 7/2/25
*/
describe("Edit Employee", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:3000");
  });

  it("edits an existing employee and updates their data", () => {
    cy.get("table.MuiTable-root")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.contains("Manage").click();
      });
    cy.contains("Employee Details").should("exist");
    cy.contains("button", "Edit").scrollIntoView().click();
    cy.contains("Edit Employee Details").should("exist");
    cy.get("label")
      .contains("First Name")
      .parent()
      .find("input")
      .clear()
      .type("UpdatedFirst");
    cy.get("label")
      .contains("Last Name")
      .parent()
      .find("input")
      .clear()
      .type("UpdatedLast");
    cy.get("label")
      .contains("Email")
      .parent()
      .find("input")
      .clear()
      .type("updated@email.com");
    cy.contains("button", "Update Employee").click();
  });
});
