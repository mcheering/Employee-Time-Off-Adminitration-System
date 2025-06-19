/*
Author: Matthew Heering
Description: e2e testing to verify adding fiscal years workflow works correctly. 
Date: 6/18/25
*/
describe("Admin Workflow - Manage Fiscal Years", () => {
  it("adds a new fiscal year successfully", () => {
    const futureYear = new Date().getFullYear() + 5;
    const startDate = `${futureYear}-07-01`;
    const endDate = `${futureYear + 1}-06-30`;

    cy.visit("http://localhost:3000/admin/dashboard");
    cy.contains("Manage Fiscal Years").click();
    cy.contains("Add Fiscal Year").click();

    cy.get('input[type="date"]').eq(0).type(startDate);
    cy.get('input[type="date"]').eq(1).type(endDate);

    cy.contains("Save").click();
    cy.contains("Fiscal year saved successfully").should("be.visible");
  });
});
