// cypress/e2e/supervisor_dashboard.cy.js

describe("Supervisor Dashboard", () => {
  const email = "morsega@westga.edu";
  const password = "Password123!";

  it("navigates through supervisor dashboard functionality", () => {
    // ——— Log in ———
    cy.visit("http://127.0.0.1:3000/employees/sign_in");
    cy.get("input[type='text']").clear().type(email);
    cy.get("input[type='password']").clear().type(password);
    cy.contains("Log In").click();

    // ——— Go to Supervisor Dashboard & pick FY ———
    cy.contains("Supervisor Dashboard").click();

    // open Fiscal Year dropdown and select 2024-25
    cy.get('[role="combobox"]').eq(0).click();
    cy.get('li[role="option"]')
      .contains("2024–2025") // <-- copy/paste the exact menu text
      .click();
    // now you have rows to Manage
    cy.contains("Manage").first().click();
    cy.url().should("include", "/supervisors/").and("include", "/manage");

    // ——— Make a decision ———
    cy.contains("Approve").click();
    cy.contains(/Supervisor Decision:\s*approved/i).should("exist");

    cy.contains("Back to Dashboard").click();
    cy.url().should("match", /\/supervisors\/\d+$/);

    // ——— Other nav links ———
    cy.contains("Calendar").click();
    cy.contains("Employee Records").click();
    cy.contains("Employee Records").should("exist");
  });
});
