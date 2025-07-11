describe("Admin Dashboard", () => {
  const email = "morsega@westga.edu";
  const password = "Password123!";

  it("navigates through admin dashboard functionality", () => {
    cy.visit("http://127.0.0.1:3000/employees/sign_in");

    // Login
    cy.get("input[type='text']").clear().type(email);
    cy.get("input[type='password']").clear().type(password);
    cy.contains("Log In").click();
    cy.contains("Admin Dashboard").click();

    // --- Manage Employees ---
    cy.contains(/^Manage Employees$/).click();
    cy.contains(/^Manage$/)
      .first()
      .click();

    cy.contains(/^Edit$/).click();

    cy.get('input[name="first_name"]')
      .invoke("val")
      .then((val) => {
        cy.get('input[name="first_name"]').clear().type(`${val}s`);
      });
    cy.contains(/^Update Employee$/).click();

    cy.wait(2000); // give the update time to process

    // --- Manage Fiscal Years ---
    cy.contains(/^Manage Fiscal Years$/).click();

    let maxEndDate = "2000-01-01";

    cy.get("table tbody tr")
      .each(($row) => {
        const endDateText = $row.find("td").eq(2).text().trim();
        if (Date.parse(endDateText) > Date.parse(maxEndDate)) {
          maxEndDate = endDateText;
        }
      })
      .then(() => {
        const nextStart = new Date(maxEndDate);
        nextStart.setDate(nextStart.getDate() + 1);

        const nextEnd = new Date(nextStart);
        nextEnd.setFullYear(nextEnd.getFullYear() + 1);
        nextEnd.setDate(nextEnd.getDate() - 1);

        const startDate = nextStart.toISOString().split("T")[0];
        const endDate = nextEnd.toISOString().split("T")[0];

        cy.log(`Creating Fiscal Year: ${startDate} → ${endDate}`);

        cy.contains(/^Add Fiscal Year$/).click();

        cy.get('input[type="date"]').eq(0).clear().type(startDate);
        cy.get('input[type="date"]').eq(1).clear().type(endDate);

        cy.contains(/^Save$/).click();

        cy.contains("Fiscal year saved successfully").should("exist");
      });

    cy.wait(2000);

    cy.contains(/^Fiscal Year Employees$/).click();

    cy.get("label")
      .contains("Fiscal Year")
      .parent() // the FormControl wrapper
      .click();

    cy.get('ul[role="listbox"] li').contains("2024-25").click();

    cy.contains(/^Manage$/)
      .first()
      .click();

    cy.contains(/^Edit$/).click();

    cy.get('input[name="first_name"]')
      .invoke("val")
      .then((val) => {
        if (!val.endsWith("s")) {
          cy.get('input[name="first_name"]').clear().type(`${val}s`);
        }
      });
    cy.contains(/^Update Employee$/).click();

    cy.wait(2000);

    cy.contains(/^Manage Employee Time-Offs$/).click();
    cy.contains(/^Manage$/)
      .first()
      .click();

    cy.url().then((url) => {
      if (!url.includes("/manage")) {
        cy.visit(`${url}/manage`);
      }
    });

    cy.contains(/^Approve Request$/).click();

    cy.contains(/^Back to Dashboard$/).click();

    cy.contains(/^Admin Dashboard$/).should("exist");
  });
});
