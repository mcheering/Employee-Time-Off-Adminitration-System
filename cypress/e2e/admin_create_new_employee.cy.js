/*
Author: Matthew Heering
Description: e2e testing to verify creating a new employee works as expected. 
Date: 6/18/25
*/
describe("Admin Create New Employee Flow", () => {
  it("allows admin to create a new employee", () => {
    cy.visit("http://127.0.0.1:3000");
    cy.contains("Add New Employee").click();
    cy.get("input[name='first_name']").type("John");
    cy.get("input[name='last_name']").type("Doe");
    const uuid = () => Cypress._.random(0, 1e6);
    const testEmail = `john.doe${uuid()}@example.com`;
    cy.get("input[name='email']").type(testEmail);
    cy.get("input[name='password']").type("SecurePass123!");
    cy.get("input[name='password_confirmation']").type("SecurePass123!");
    cy.get("input[name='hire_date']").type("2025-07-02");
    cy.get("input[name='termination_date']").type("2026-07-02");
    cy.get(
      'div[role="combobox"][id="mui-component-select-supervisor_id"]'
    ).click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.get("input[name='is_supervisor']").check({ force: true });
    cy.get("input[name='is_administrator']").check({ force: true });
    cy.contains("Create Employee").click();
  });
});
