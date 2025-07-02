describe("Edit Employee", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:3000");
  });

  it("edits an existing employee and updates their data", () => {
    // Click 'Manage' on the first row
    cy.get("table.MuiTable-root")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.contains("Manage").click();
      });

    // Wait for Employee Details page to load
    cy.contains("Employee Details").should("exist");

    // Click the EDIT button and wait for redirect
    cy.contains("button", "Edit").scrollIntoView().click();

    // Wait for Edit Employee form
    cy.contains("Edit Employee Details").should("exist");

    // === Update form values ===
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

    // Submit form
    cy.contains("button", "Update Employee").click();
  });
});
