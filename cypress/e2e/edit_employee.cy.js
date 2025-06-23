/*
Author: Matthew Heering
Description: e2e testing to verify the work flow to edit an employee's data works correctly and handles exceptions. 
Date: 6/18/25
*/
describe("Admin Workflow - Edit Employee Supervisor", () => {
  it("navigates from dashboard, edits supervisor, and submits", () => {
    cy.visit("http://localhost:3000/");

    cy.get("table").within(() => {
      cy.contains("button", "Manage").first().click();
    });

    cy.contains("Edit").should("be.visible").click();

    cy.get('[name="supervisor_id"]').parent().click();
    cy.get('ul[role="listbox"] li').eq(1).click();

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/employees/");
    cy.wait(1600);
    cy.url().should("include", "/employees");
  });

  it("navigates from dashboard, starts editing, and cancels", () => {
    cy.visit("http://localhost:3000/");

    cy.get("table").within(() => {
      cy.contains("button", "Manage").eq(0).click();
    });

    cy.url().should("match", /\/employees\/\d+$/);

    cy.contains("Edit").should("be.visible").click();

    cy.get("form").should("exist");

    cy.contains("Cancel").click();
    cy.url().should("include", "/");
  });
});
