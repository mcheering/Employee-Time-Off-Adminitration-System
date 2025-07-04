/*
Author: Matthew Heering
Description: E2E test — approve a request & verify status updated.
Date: 7/3/25
*/

describe("Supervisor Manage Request", () => {
  const baseUrl = "http://127.0.0.1:3000";
  const supervisorId = 12;
  const requestId = 8;
  const manageUrl = `${baseUrl}/supervisors/${supervisorId}/time_off_requests/${requestId}/manage`;

  it("approves a request and verifies status", () => {
    cy.visit(manageUrl);

    cy.contains(/Manage Time-Off Request/i).should("exist");

    cy.contains(/^Approve$/i).click();

    cy.contains(/approved/i).should("exist");
  });
});
