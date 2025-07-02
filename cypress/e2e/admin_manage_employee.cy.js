describe("Admin Manage Employee Flow", () => {
  it("allows admin to view and edit employee details", () => {
    cy.visit("http://127.0.0.1:3000");

    // Make sure the Manage Employees tab is visible and selected
    cy.contains("Manage Employees").should("exist");

    // Click the first "Manage" button within the employee table
    cy.get("table").within(() => {
      cy.contains("Manage").first().click();
    });

    // Verify the Employee Details view appears
    cy.contains("Employee Details").should("exist");
    cy.contains("First Name").should("exist");
    cy.contains("Last Name").should("exist");
  });
});
