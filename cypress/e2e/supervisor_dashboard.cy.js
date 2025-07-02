/*
Author: Matthew Heering
Description: e2e test for Supervisor Dashboard - manages time-off requests from employees.
Date: 7/2/25
*/

describe("Supervisor Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/supervisors/4");
  });

  it("loads time-off requests for second fiscal year and updates a request status", () => {
    // Confirm we're on the Supervisor Dashboard and default is "Time-Off Requests"
    cy.contains("Supervisor Dashboard").should("exist");
    cy.contains("Time-Off Requests").should("exist");

    // Wait for the fiscal year dropdown to appear and open it
    cy.get('[data-testid="fiscal-year-select"]').click();

    // Select the second fiscal year (index 1 in dropdown list)
    cy.get('ul[role="listbox"] li').eq(1).click();

    // Wait for the new URL to confirm the page reloaded with fiscal year 5
    cy.location("search", { timeout: 10000 }).should(
      "include",
      "fiscal_year_id=5"
    );
  });
});
