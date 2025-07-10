describe("Supervisor Dashboard", () => {
  const email = "perry@huels-shields.test";
  const password = "Password123!";

  it("navigates through supervisor dashboard functionality", () => {
    cy.visit("http://127.0.0.1:3000/employees/sign_in");
    cy.get("input[type='text']").clear().type(email);
    cy.get("input[type='password']").clear().type(password);
    cy.contains("Log In").click();
    cy.contains("Supervisor Dashboard").click();
    cy.contains("Manage").first().click();
    cy.url().should("include", "/supervisors/").and("include", "/manage");
    cy.contains("Approve").click();
    cy.contains(/Supervisor Decision:\s*approved/i).should("exist");
    cy.contains("Back to Dashboard").click();
    cy.url().should("match", /\/supervisors\/\d+$/);
    cy.contains("Calendar").click();
    cy.contains("Employee Records").click();
    cy.contains("Employee Records").should("exist");
  });
});
