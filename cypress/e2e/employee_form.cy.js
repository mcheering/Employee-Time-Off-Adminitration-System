/*
Author: Matthew Heering
Description: e2e testing to verify creating a new employee works as expected. 
Date: 6/18/25
*/
describe("Create New Employee", () => {
  it("successfully creates a new employee", () => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    cy.visit("http://localhost:3000/employees/new");
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="last_name"]').type("Doe");
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="password_confirmation"]').type("Password123!");
    cy.get('input[name="hire_date"]').type("2022-01-01");
    cy.get('input[name="termination_date"]').type("2023-01-01");
    cy.get('[name="supervisor_id"]').parent().click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.get('input[name="is_supervisor"]').check();
    cy.get('input[name="is_administrator"]').uncheck();
    cy.get('button[type="submit"]').click();
    cy.contains("Employee created!").should("be.visible");
  });
});
