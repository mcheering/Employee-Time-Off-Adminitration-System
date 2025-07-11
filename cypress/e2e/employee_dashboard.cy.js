// cypress/e2e/employee_dashboard.cy.js

describe("Employee Dashboard E2E", () => {
  it("logs in, navigates employee dashboard, edits request, and submits new request", () => {
    // ——— Log in ———
    cy.visit("http://127.0.0.1:3000/employees/sign_in");
    cy.get("input[type='text']").clear().type("morsega@westga.edu");
    cy.get("input[type='password']").clear().type("Password123!");
    cy.contains("Log In").click();

    // ——— Employee Dashboard & filter by Fiscal Year ———
    cy.contains("Employee Dashboard").click();
    cy.get('[role="combobox"]').eq(0).click();
    cy.get('li[role="option"]').contains("2024-25").click();

    // ——— View existing request ———
    cy.contains("View").click();
    cy.url().should("include", "/time_off_requests/");
    cy.contains("Back").click();
    cy.url().should("match", /\/employees\/\d+$/);

    // ——— Edit that request ———
    cy.get('[role="combobox"]').eq(0).click();
    cy.get('li[role="option"]').contains("2024-25").click();
    cy.contains("Edit").click();
    cy.url().should("include", "/edit");

    // ——— In edit form, re-select fiscal year ———
    cy.get('[role="combobox"]').eq(0).click();
    cy.get('li[role="option"]').contains("2024-25").click();

    // update fields
    cy.get('input[name="is_fmla"]').check({ force: true });
    cy.get('textarea[name="comment"]').clear().type("This is a test");
    cy.contains("Update Request").click();
    cy.url().should("match", /\/employees\/\d+$/);

    // ——— Submit a new request ———
    cy.contains("Request Time Off").click();
    cy.url().should("include", "/time_off_requests/new");

    // pick fiscal year
    cy.get('[role="combobox"]').eq(0).click();
    cy.get('li[role="option"]').contains("2025-26").click();

    // select reason
    cy.get('[role="combobox"]').eq(1).click();
    cy.get('li[role="option"]').contains("Vacation").click();

    // fill out remaining form fields
    cy.get('input[name="is_fmla"]').check({ force: true });
    cy.get('textarea[name="comment"]').clear().type("New request test");
    cy.get('input[type="date"]').clear().type("2025-07-10");

    // select amount
    cy.get('[role="combobox"]').eq(2).click();
    cy.get('li[role="option"]').contains("Full Day").click();

    // ——— add the requested day ———
    cy.contains("button", /^Add$/).click();

    // verify it appears
    cy.contains("2025-07-10").should("exist");

    // ——— submit the request ———
    cy.contains("Submit Request").click();
    cy.url().should("match", /\/employees\/\d+$/);

    // ——— Final assertion ———
    cy.contains(/Time-Off Dashboard/).should("exist");
  });
});
