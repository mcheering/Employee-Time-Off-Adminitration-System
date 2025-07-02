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
    cy.contains("Supervisor Dashboard").should("exist");
    cy.contains("Time-Off Requests").should("exist");
    cy.get('[data-testid="fiscal-year-select"]').click();
    cy.get('ul[role="listbox"] li').eq(1).click();
    cy.location("search", { timeout: 10000 }).should(
      "include",
      "fiscal_year_id=5"
    );
  });
});
