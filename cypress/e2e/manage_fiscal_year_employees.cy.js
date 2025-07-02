/*
Author: Matthew Heering
Description: e2e testing to verify the manage fiscal year employee table correctly renders all employees, and that clicking manage displays the show panel.
Date: 6/18/25
*/

describe("Admin Workflow - Fiscal Year Employees Filter", () => {
  function testFiscalYearOptions(years, index = 0) {
    if (index >= years.length) return;

    const yearText = years[index].innerText.trim();

    cy.visit("http://localhost:3000/");
    cy.contains("button", "Fiscal Year Employees").click();

    cy.get("#fiscal-year-label")
      .invoke("attr", "id")
      .then((labelId) => {
        cy.get(`[aria-labelledby="${labelId}"]`).click();
      });

    cy.get('ul[role="listbox"] li').contains(yearText).click();

    cy.get("table tbody").then(($tbody) => {
      const rows = $tbody.find("tr");
      if (rows.length === 0) {
        cy.log(`No employees for fiscal year ${yearText}, skipping...`);
        cy.then(() => testFiscalYearOptions(years, index + 1));
      } else {
        cy.wrap(rows).each(($row) => {
          cy.wrap($row).find("td").eq(2).should("have.text", yearText);
        });

        cy.wrap(rows[0]).contains("Manage").click();

        // ✅ Confirm content for employee details is rendered
        cy.contains("Employee Details").should("exist");
        cy.contains("First Name").should("exist");
        cy.contains("Hire Date").should("exist");

        // Proceed to next fiscal year
        cy.then(() => testFiscalYearOptions(years, index + 1));
      }
    });
  }

  it("filters employees by each fiscal year and validates table results and navigation", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("button", "Fiscal Year Employees").click();

    cy.get("#fiscal-year-label")
      .invoke("attr", "id")
      .then((labelId) => {
        cy.get(`[aria-labelledby="${labelId}"]`).click();
      });

    cy.get('ul[role="listbox"] li').then(($options) => {
      const options = [...$options];
      testFiscalYearOptions(options);
    });
  });
});
