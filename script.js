/* =========================================
   ELECTRA
   ELECTRICITY BILL CALCULATOR
   ========================================= */


/* =========================================
   DEFAULT TARIFF SETTINGS
========================================= */

const DEFAULT_TARIFF = {

    rate1: 2,

    rate2: 5,

    rate3: 8,

    fixedCharge: 100,

    tax: 5

};


/* =========================================
   HELPER FUNCTIONS
========================================= */

function getElement(id) {

    return document.getElementById(id);

}


function formatCurrency(amount) {

    return "₹" + Number(amount).toFixed(2);

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

}


function getMonthYear(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {

        month: "long",

        year: "numeric"

    });

}


/* =========================================
   CALCULATOR PAGE
========================================= */

const calculateBtn = getElement("calculateBtn");


if (calculateBtn) {

    initializeCalculator();

}


/* =========================================
   INITIALIZE CALCULATOR
========================================= */

function initializeCalculator() {

    const billDate = getElement("billDate");

    const rate1 = getElement("rate1");
    const rate2 = getElement("rate2");
    const rate3 = getElement("rate3");

    const fixedCharge = getElement("fixedCharge");

    const tax = getElement("tax");


    /* Today's date */

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");


    billDate.value =
        `${year}-${month}-${day}`;


    /* Default tariff */

    rate1.value = DEFAULT_TARIFF.rate1;

    rate2.value = DEFAULT_TARIFF.rate2;

    rate3.value = DEFAULT_TARIFF.rate3;

    fixedCharge.value =
        DEFAULT_TARIFF.fixedCharge;

    tax.value =
        DEFAULT_TARIFF.tax;


    calculateBtn.addEventListener(
        "click",
        calculateBill
    );

}


/* =========================================
   CALCULATE BILL
========================================= */

function calculateBill() {

    const errorBox =
        getElement("errorMessage");


    /* Clear previous error */

    errorBox.textContent = "";

    errorBox.classList.remove("show");


    /* Get values */

    const billDate =
        getElement("billDate").value;

    const units =
        Number(getElement("units").value);

    const rate1 =
        Number(getElement("rate1").value);

    const rate2 =
        Number(getElement("rate2").value);

    const rate3 =
        Number(getElement("rate3").value);

    const fixedCharge =
        Number(getElement("fixedCharge").value);

    const taxPercent =
        Number(getElement("tax").value);


    /* =====================================
       VALIDATION
    ===================================== */

    if (!billDate) {

        showError(
            "Please select a billing date."
        );

        return;
    }


    if (
        !Number.isFinite(units) ||
        units < 0
    ) {

        showError(
            "Please enter a valid electricity unit value."
        );

        return;
    }


    if (
        rate1 < 0 ||
        rate2 < 0 ||
        rate3 < 0 ||
        fixedCharge < 0
    ) {

        showError(
            "Tariff values cannot be negative."
        );

        return;
    }


    if (
        !Number.isFinite(taxPercent) ||
        taxPercent < 0 ||
        taxPercent > 100
    ) {

        showError(
            "Tax must be between 0% and 100%."
        );

        return;
    }


    /* =====================================
       SLAB CALCULATION
    ===================================== */

    let slab1Units = 0;

    let slab2Units = 0;

    let slab3Units = 0;


    let slab1Amount = 0;

    let slab2Amount = 0;

    let slab3Amount = 0;


    /* FIRST SLAB */

    if (units <= 100) {

        slab1Units = units;

        slab1Amount =
            slab1Units * rate1;

    }


    /* SECOND SLAB */

    else if (units <= 300) {

        slab1Units = 100;

        slab2Units =
            units - 100;


        slab1Amount =
            slab1Units * rate1;


        slab2Amount =
            slab2Units * rate2;

    }


    /* THIRD SLAB */

    else {

        slab1Units = 100;

        slab2Units = 200;

        slab3Units =
            units - 300;


        slab1Amount =
            slab1Units * rate1;


        slab2Amount =
            slab2Units * rate2;


        slab3Amount =
            slab3Units * rate3;

    }


    /* =====================================
       ENERGY CHARGE
    ===================================== */

    const energyCharge =
        slab1Amount +
        slab2Amount +
        slab3Amount;


    /* =====================================
       SUBTOTAL
    ===================================== */

    const subtotal =
        energyCharge +
        fixedCharge;


    /* =====================================
       TAX
    ===================================== */

    const taxAmount =
        subtotal *
        (taxPercent / 100);


    /* =====================================
       FINAL BILL
    ===================================== */

    const totalBill =
        subtotal +
        taxAmount;


    /* =====================================
       CREATE BILL OBJECT
    ===================================== */

    const bill = {

        date: billDate,

        monthYear:
            getMonthYear(billDate),

        formattedDate:
            formatDate(billDate),

        units: units,

        rates: {

            rate1: rate1,

            rate2: rate2,

            rate3: rate3

        },

        slab1Units: slab1Units,

        slab2Units: slab2Units,

        slab3Units: slab3Units,

        slab1Amount: slab1Amount,

        slab2Amount: slab2Amount,

        slab3Amount: slab3Amount,

        energyCharge: energyCharge,

        fixedCharge: fixedCharge,

        subtotal: subtotal,

        taxPercent: taxPercent,

        taxAmount: taxAmount,

        totalBill: totalBill

    };


    /* =====================================
       SAVE CURRENT BILL
    ===================================== */

    localStorage.setItem(

        "currentBill",

        JSON.stringify(bill)

    );


    /* =====================================
       SAVE HISTORY
    ===================================== */

    let history =
        JSON.parse(
            localStorage.getItem("billHistory")
        ) || [];


    history.unshift(bill);


    /* Keep latest 10 */

    history =
        history.slice(0, 10);


    localStorage.setItem(

        "billHistory",

        JSON.stringify(history)

    );


    /* =====================================
       OPEN RESULT PAGE
    ===================================== */

    window.location.href =
        "result.html";

}


/* =========================================
   ERROR MESSAGE
========================================= */

function showError(message) {

    const errorBox =
        getElement("errorMessage");


    if (!errorBox) {

        return;

    }


    errorBox.textContent =
        message;


    errorBox.classList.add("show");

}


/* =========================================
   RESULT PAGE
========================================= */

const totalAmount =
    getElement("totalAmount");


if (totalAmount) {

    loadResultPage();

}


function loadResultPage() {

    const savedBill =
        localStorage.getItem("currentBill");


    if (!savedBill) {

        window.location.href =
            "calculator.html";

        return;

    }


    const bill =
        JSON.parse(savedBill);


    /* Header */

    getElement("resultDate").textContent =
        `${bill.monthYear} • ${bill.formattedDate}`;


    /* Total */

    getElement("totalAmount").textContent =
        formatCurrency(bill.totalBill);


    getElement("totalUnits").textContent =
        `${bill.units} units consumed`;


    /* Summary */

    getElement("energyCharge").textContent =
        formatCurrency(bill.energyCharge);


    getElement("fixedChargeResult").textContent =
        formatCurrency(bill.fixedCharge);


    getElement("subtotal").textContent =
        formatCurrency(bill.subtotal);


    getElement("taxLabel").textContent =
        `Tax (${bill.taxPercent}%)`;


    getElement("taxAmount").textContent =
        formatCurrency(bill.taxAmount);


    /* Step-by-step */

    const breakdown =
        getElement("calculationBreakdown");


    breakdown.innerHTML = "";


    /* SLAB 1 */

    if (bill.slab1Units > 0) {

        addBreakdown(

            breakdown,

            `First ${bill.slab1Units} units`,

            `${bill.slab1Units} × ${formatCurrency(bill.rates.rate1)}`,

            bill.slab1Amount

        );

    }


    /* SLAB 2 */

    if (bill.slab2Units > 0) {

        addBreakdown(

            breakdown,

            `Next ${bill.slab2Units} units`,

            `${bill.slab2Units} × ${formatCurrency(bill.rates.rate2)}`,

            bill.slab2Amount

        );

    }


    /* SLAB 3 */

    if (bill.slab3Units > 0) {

        addBreakdown(

            breakdown,

            `Above 300 units (${bill.slab3Units})`,

            `${bill.slab3Units} × ${formatCurrency(bill.rates.rate3)}`,

            bill.slab3Amount

        );

    }


    /* ENERGY */

    addBreakdown(

        breakdown,

        "Energy Charge",

        "Slab charges combined",

        bill.energyCharge

    );


    /* FIXED */

    addBreakdown(

        breakdown,

        "Fixed Charge",

        "Monthly fixed charge",

        bill.fixedCharge

    );


    /* SUBTOTAL */

    addBreakdown(

        breakdown,

        "Subtotal",

        "Energy + Fixed Charge",

        bill.subtotal

    );


    /* TAX */

    addBreakdown(

        breakdown,

        `Tax (${bill.taxPercent}%)`,

        `${bill.subtotal.toFixed(2)} × ${bill.taxPercent}%`,

        bill.taxAmount

    );


    /* FINAL */

    addBreakdown(

        breakdown,

        "Final Amount",

        "Subtotal + Tax",

        bill.totalBill

    );

}


/* =========================================
   ADD BREAKDOWN ROW
========================================= */

function addBreakdown(

    container,
    label,
    formula,
    amount

) {

    const row =
        document.createElement("div");


    row.className =
        "calculation-row";


    row.innerHTML = `

        <div>

            <strong>
                ${label}
            </strong>

            <small>
                ${formula}
            </small>

        </div>

        <strong>
            ${formatCurrency(amount)}
        </strong>

    `;


    container.appendChild(row);

}


/* =========================================
   HISTORY PAGE
========================================= */

const historyList =
    getElement("historyList");


if (historyList) {

    loadHistoryPage();

}


/* =========================================
   LOAD HISTORY
========================================= */

function loadHistoryPage() {

    let history =
        JSON.parse(
            localStorage.getItem("billHistory")
        ) || [];


    const billCount =
        getElement("billCount");

    const totalUnits =
        getElement("totalHistoryUnits");

    const averageBill =
        getElement("averageBill");


    /* Statistics */

    billCount.textContent =
        history.length;


    const unitsTotal =
        history.reduce(

            (sum, bill) =>
                sum + Number(bill.units),

            0

        );


    totalUnits.textContent =
        unitsTotal;


    const billTotal =
        history.reduce(

            (sum, bill) =>
                sum + Number(bill.totalBill),

            0

        );


    const average =
        history.length > 0
            ? billTotal / history.length
            : 0;


    averageBill.textContent =
        formatCurrency(average);


    /* Empty */

    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <div>
                    📄
                </div>

                <h3>
                    No Bills Yet
                </h3>

                <p>
                    Calculate your first electricity bill
                    to see it here.
                </p>

                <a
                    href="calculator.html"
                    class="primary-btn"
                >
                    Calculate Your First Bill →
                </a>

            </div>

        `;

        return;

    }


    /* Clear */

    historyList.innerHTML = "";


    /* Display */

    history.forEach(

        (bill, index) => {

            const item =
                document.createElement("div");


            item.className =
                "history-item";


            item.innerHTML = `

                <div class="history-main">

                    <div class="history-icon">
                        ⚡
                    </div>

                    <div>

                        <h3>
                            ${bill.monthYear}
                        </h3>

                        <p>
                            ${bill.formattedDate}
                            •
                            ${bill.units} units
                        </p>

                    </div>

                </div>


                <div class="history-right">

                    <strong>
                        ${formatCurrency(bill.totalBill)}
                    </strong>

                    <span>
                        Bill #${history.length - index}
                    </span>

                </div>

            `;


            historyList.appendChild(item);

        }

    );

}


/* =========================================
   CLEAR HISTORY
========================================= */

const clearHistoryBtn =
    getElement("clearHistoryBtn");


if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(

        "click",

        function () {

            const history =
                JSON.parse(
                    localStorage.getItem("billHistory")
                ) || [];


            if (history.length === 0) {

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete all saved bills?"
                );


            if (!confirmed) {

                return;

            }


            localStorage.removeItem(
                "billHistory"
            );


            loadHistoryPage();

        }

    );

}