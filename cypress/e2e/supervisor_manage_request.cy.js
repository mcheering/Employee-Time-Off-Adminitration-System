/*
Author: Matthew Heering
Description: E2E test to manage a time-off request via the Manage Request panel.
Date: 7/2/25
*/

describe("Supervisor Manage Request", () => {
  const baseUrl = "http://127.0.0.1:3000";
  const supervisorId = 12;
  const requestId = 8;
  const manageUrl = `${baseUrl}/supervisors/${supervisorId}/time_off_requests/${requestId}/manage`;
  const dashboardUrl = `${baseUrl}/supervisors/${supervisorId}`;

  it("approves a request", () => {
    cy.visit(manageUrl);
    cy.contains("Manage Time-Off Request").should("exist");
    cy.contains("Approve").click();

    cy.url().should("eq", dashboardUrl);
  });

  it("denies a request", () => {
    cy.visit(manageUrl);
    cy.contains("Manage Time-Off Request").should("exist");
    cy.contains("Deny").click();

    cy.url().should("eq", dashboardUrl);
  });

  it("requests more information", () => {
    cy.visit(manageUrl);
    cy.contains("Manage Time-Off Request").should("exist");
    cy.contains("Request Info").click();

    cy.url().should("eq", dashboardUrl);
  });
});
