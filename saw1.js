// Get Today's Date
var xmlHttp;
function srvTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('HEAD',window.location.href.toString(),false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
}

var st = srvTime();
let todaysDateNow = new Date(st).getTime();

function append(parent, child) {
    return parent.appendChild(child);
}

function element(selector) {
    return document.querySelector(selector);
}

function create(selector) {
    return document.createElement(selector);
}

let options = {timeZone: 'UTC', year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hourCycle: "h23" };

const body = element("body");

const headerBar = create("div");
headerBar.className = "headerBar";

const logo = create("div");
logo.className = "logo";
const heading = create("div");
heading.className = "heading";
heading.textContent = "SawRoom Dashboard";

const buttons = create("div");
buttons.className = "buttons";
const vouchers = create("a");
vouchers.innerHTML = '<i class="fas fa-gift"></i> Vouchers';
vouchers.setAttribute('href', "#");
vouchers.className = "vouchers";
const dashboard = create("a");
dashboard.innerHTML = '<i class="fas fa-columns"></i> Dashboard';
dashboard.setAttribute('href', '#');
dashboard.className = "dashboard selected";
const monthlyTables = create("a");
monthlyTables.innerHTML = '<i class="fas fa-table"></i> Tables'
monthlyTables.setAttribute('href', '#');
monthlyTables.className = "tables";

const settings = create("div");
settings.className = "settings";
const logout = create("div");
logout.className = "logout"
logout.innerHTML = 'Logout <i class="fas fa-sign-out-alt"></i>'

const dashboardDiv = create("div");
dashboardDiv.className = "dashboardDiv";

const content = create("div")
content.className = "content";
const table = create("table");
table.className = "reservationsList";
const tableHeadDashboard = create("thead");
const tableHeadDashboardProperties = `
<tr class="tableHeadRow">
    <th>Date</th>
    <th>Status</th>
    <th>Name</th>
    <th>Phone</th>
    <th>People</th>
    <th class="hiddenOnSmallerDesktops">Email</th>
    <th>Team Name</th>
    <th class="hiddenOnSmallerDesktops">Game Mode</th>
    <th class="hiddenOnSmallerDesktops">Made On</th>
    <th class="hiddenOnSmallerDesktops">Language</th>
    <th class="hiddenOnSmallerDesktops">Discount</th>
    <th>Actions</th>
</tr>
`
const tableBody = create("tbody");
tableBody.className = "reservationsListBody";

const input = create("input");
input.className = "dateSearch"
input.setAttribute('type', 'text');
input.setAttribute('placeholder', 'Search by Date');

const loadDataDashboard = (data) => {
    tableHeadDashboard.innerHTML = tableHeadDashboardProperties;

    body.append(dashboardDiv)
    dashboardDiv.append(content);
    content.append(input);
    content.append(table);
    table.append(tableHeadDashboard);
    table.append(tableBody);

    let html = '';
    data.forEach(doc => {
        const reservation = doc.data();
        const tr = `
        <tr class="reservations" data-id="${reservation.booking}">
            <td class="dash">${new Date(reservation.booking).toLocaleDateString('en-GB', options)}</td>
            <td class="dash">${reservation.status}</td>
            <td class="dash"><input type="text" class="editInputNameCurrent" readonly value="${reservation.name}"></td>
            <td class="dash hiddenOnMobile"><a href="tel:${reservation.phone}"><input onclick="this.select()" type="text" class="editInputPhoneCurrent" readonly value="${reservation.phone}"></a></td>
            <td class="dash"><input type="text" class="editInputPeopleCurrent" readonly value="${reservation.people}"> (<input type="text" class="editInputMoneyCurrent" readonly value="${reservation.money}">лв.)</td>
            <td class="dash hiddenOnSmallerDesktops"><input onclick="this.select()" type="text" class="editInputEmailCurrent" readonly value="${reservation.email}"></td>
            <td class="dash"><input type="text" class="editInputTeamNameCurrent" readonly value="${reservation.teamname}"></td>
            <td class="dash hiddenOnSmallerDesktops"><input type="text" class="editInputGameModeCurrent" readonly value="${reservation.gamemode}"></td>
            <td class="dash hiddenOnSmallerDesktops">${new Date(reservation.madeOn).toLocaleDateString('en-GB', options)}</td>
            <td class="dash hiddenOnSmallerDesktops"><input type="text" class="editInputLanguageCurrent" readonly value="${reservation.language}"></td>
            <td class="dash hiddenOnSmallerDesktops"><input type="text" class="editInputDiscountCurrent" readonly value="${reservation.discount}"></td>
            <td class="dash"><span class="showOnMobile"><a href="tel:${reservation.phone}"></a></span>${reservation.buttons}<i id="showAllInfo" class="far fa-eye"><span>Show</span></i></td>
        </tr>
        `
        html += tr;
        
    })

    tableBody.innerHTML = html;

    Date.prototype.getFullMinutes = function () {
        if (this.getMinutes() < 10) {
            return '0' + this.getMinutes();
        }
        return this.getMinutes();
     };

     document.querySelectorAll("#showAllInfo").forEach(element => {
         element.addEventListener("click", function() {
            const confirmDialog = document.querySelector(".confirmDialog");
            confirmDialog.style.display = "flex";
            confirmDialog.innerHTML = `
            <div class="container">
                <div class="heading">All reservation data</div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Date</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[0].textContent}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Name</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[2].children[0].value}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Phone</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[3].children[0].children[0].value}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">People</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[4].children[0].value} (${element.parentElement.parentElement.children[4].children[1].value}лв.)</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Email</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[5].children[0].value}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Team Name</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[6].children[0].value}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Game Mode</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[7].children[0].value}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Made On</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[8].textContent}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Language</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[9].children[0].value}</span>
                </div>
                <div style="text-align: left;">
                    <span class="reservationHeadText">Discount</span>
                    <span class="reservationBodyText">${element.parentElement.parentElement.children[10].children[0].value}</span>
                </div>
                <div style="margin-top: 20px;" class="decline">Close</div>
            </div>
            `
            document.querySelector(".decline").addEventListener("click", function() {
                confirmDialog.style.display = "none";
            })
         })
     })

     document.querySelectorAll(".confirmation").forEach(element => {
        element.addEventListener("click", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            docRef.get().then(function(doc) {
                if (doc.data().status == '<i class="fas fa-minus-circle confirmation"></i>') {
                    sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id")).update({status: '<i class="fas fa-check-circle confirmation"></i>'})
                    element.classList.remove("fa-minus-circle")
                    element.classList.add("fa-check-circle")
                } else {
                    sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id")).update({status: '<i class="fas fa-minus-circle confirmation"></i>'})
                    element.classList.remove("fa-check-circle")
                    element.classList.add("fa-minus-circle")
                }
        })
     })
    })

    document.querySelectorAll("#deleteBooking").forEach(element => {
        element.addEventListener("click", function() {
            const privateDocRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            const docRef = sawroomDB.collection("reservations").doc(element.parentNode.parentNode.getAttribute("data-id"));
            const confirmDialog = document.querySelector(".confirmDialog");
            confirmDialog.innerHTML = `
            <div class="container">
                <div class="heading">Are you sure?</div>
                <div class="accept">Yes</div>
                <div class="decline">Nope</div>
            </div>
            `;
            confirmDialog.style.display = "flex";
            confirmDialog.children[0].children[1].addEventListener("click", function() {
                privateDocRef.update(
                    {
                        firstOperator: firstOperator,
                        secondOperator: secondOperator
                    })
                setTimeout(() => {
                    privateDocRef.delete();
                    docRef.delete();
                    element.parentNode.parentNode.style.display = "none";
                    confirmDialog.style.display = "none";
                }, 500);
            })
            confirmDialog.children[0].children[2].addEventListener("click", function() {
                confirmDialog.style.display = "none";
            })
        })
    })

    document.querySelectorAll("#editBooking").forEach(element => {
        element.addEventListener("click", function() {
            // They are swapped, but I'm too lazy to fix them
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            const privateDocRef = sawroomDB.collection("reservations").doc(element.parentNode.parentNode.getAttribute("data-id"));

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    const reservation = doc.data();

                    function confirmEditBooking() {
                        this.parentNode.parentNode.classList.remove("editing");
                        this.setAttribute("id", "editBooking");
                        docRef.delete();
                        privateDocRef.delete();
                        sawroomDB.collection("reservations").doc((new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000).toString()).set({
                            booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000
                        })
                        sawroomDB.collection("reservationsSecure").doc((new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000).toString()).set({
                            booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000,
                            name: document.querySelector(".editInputName").value,
                            phone: document.querySelector(".editInputPhone").value,
                            email: document.querySelector(".editInputEmail").value,
                            people: document.querySelector(".editInputPeople").value,
                            money: document.querySelector(".editInputMoney").value,
                            teamname: document.querySelector(".editInputTeamName").value,
                            gamemode: document.querySelector(".editInputGameMode").value,
                            discount: document.querySelector(".editInputDiscount").value,
                            language: document.querySelector(".editInputLanguage").value,
                            status: reservation.status,
                            madeOn: reservation.madeOn,
                            firstOperator: firstOperator,
                            secondOperator: secondOperator,
                            timeInRoom: "00:00:00",
                            operatorReload: `<i class="operatorReload fas fa-redo"></i>`,
                            buttons: '<i id="editBooking" class="fas fa-pen"><span>Edit</span></i><i id="deleteBooking" class="fas fa-minus-square"><span>Delete</span></i>'
                        })
                        this.parentNode.parentNode.innerHTML = `
                            <td>${new Date(new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000).toLocaleDateString('en-GB', options)}</td>
                            <td class="dash hiddenOnMobile">${reservation.status}</td>
                            <td class="dash"><input type="text" class="editInputName" readonly value="${document.querySelector(".editInputName").value}"></td>
                            <td class="dash"><input type="text" class="editInputPhone" readonly value="${document.querySelector(".editInputPhone").value}"></td>
                            <td class="dash"><input type="text" class="editInputPeople" readonly value="${document.querySelector(".editInputPeople").value}"> (<input type="text" class="editInputMoney" readonly value="${document.querySelector(".editInputMoney").value}">лв.)</td>
                            <td class="dash"><input type="text" class="editInputEmail" readonly value="${document.querySelector(".editInputEmail").value}"></td>
                            <td class="dash"><input type="text" class="editInputTeamName" readonly value="${document.querySelector(".editInputTeamName").value}"></td>
                            <td class="dash"><input type="text" class="editInputGameMode" readonly value="${document.querySelector(".editInputGameMode").value}"></td>
                            <td class="dash">${new Date(reservation.madeOn).toLocaleDateString('en-GB', options)}</td>
                            <td class="dash"><input type="text" class="editInputLanguage" readonly value="${document.querySelector(".editInputLanguage").value}"></td>
                            <td class="dash"><input type="text" class="editInputDiscount" readonly value="${document.querySelector(".editInputDiscount").value}"></td>
                            <td class="dash">${reservation.buttons}</td>
                        `
                    }

                    element.parentNode.parentNode.classList.add("editing");
                    element.parentNode.parentNode.innerHTML = `
                        <td class="dash"><input type="date" class="editInputDate" value="${new Date(reservation.booking).toLocaleDateString('en-CA')}">
                            <input type="time" class="editInputTime" value="${new Date(reservation.booking).getUTCHours()}:${new Date(reservation.booking).getFullMinutes()}"></td>
                        <td class="dash hiddenOnMobile">${reservation.status}</td>
                        <td class="dash"><input type="text" class="editInputName" value="${reservation.name}"></td>
                        <td class="dash"><input type="text" class="editInputPhone" value="${reservation.phone}"></td>
                        <td class="dash"><input type="text" class="editInputPeople" value="${reservation.people}">
                            (<input type="text" class="editInputMoney" value="${reservation.money}">лв.)</td>
                        <td class="dash"><input type="text" class="editInputEmail" value="${reservation.email}"></td>
                        <td class="dash"><input type="text" class="editInputTeamName" value="${reservation.teamname}"></td>
                        <td class="dash"><input type="text" class="editInputGameMode" value="${reservation.gamemode}"></td>
                        <td class="dash">${new Date(reservation.madeOn).toLocaleDateString('en-GB', options)}</td>
                        <td class="dash"><input type="text" class="editInputLanguage" value="${reservation.language}"></td>
                        <td class="dash"><input type="text" class="editInputDiscount" value="${reservation.discount}"></td>
                        <td class="dash">
                        <i id="confirmEditBooking" class="fas fa-pen"><span>Confirm Edit</span></i>
                        </td>
                    `

                    document.querySelectorAll("#confirmEditBooking").forEach(element => {
                        element.addEventListener("click", confirmEditBooking);
                    })

                    
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        })
    })
    
    document.querySelectorAll(".reservations").forEach(element => {
        // if(element.getAttribute("data-id") < new Date().getTime()) {
        //     element.style.display = "none";
        // }
        // if(element.children[1].textContent == "Не") {
        //     element.style.display = "none";
        // }

        // Show one month up ahead and one month behind only
        if(new Date(parseInt(element.getAttribute("data-id"))).getMonth() >= new Date().getMonth() -1 &&
        new Date(parseInt(element.getAttribute("data-id"))).getMonth() <= new Date().getMonth() + 1
        ){
            element.style.display = "";
        } else {
            element.style.display = "none";
        }
    })

    // Search by Date
    document.querySelector(".dateSearch").addEventListener("keyup", function(){
        let input, filter, tables, tr, td, i, txtValue;
        input = document.querySelector(".dateSearch");

        filter = input.value.toUpperCase();
        tables = document.querySelector(".reservationsListBody");
        tr = tables.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            txtValue = td.textContent || td.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    })

    // Mobile version

    if (screen.width < 1000) {
        document.querySelectorAll("tr.reservations").forEach(element => {
            console.log(element);
        })
    }
}

// Load Data Monthly Tables
const monthlyTablesDiv = create("div");
monthlyTablesDiv.className = "monthlyTables";
const todaysMonth = create("div");
todaysMonth.className = "todaysMonth";
const todaysMonthText = create("span");
todaysMonthText.className = "todaysMonthSelect"
const todaysMonthTextCurrentMonth = create("span");
todaysMonthTextCurrentMonth.className = "currentMonth"
const todaysMonthTextAllMonths = create("div");
todaysMonthTextAllMonths.className = "allMonths";
const todaysMonthTextMonth = create("div");
todaysMonthTextMonth.className = "month";
const span = create("span");
span.className = "flex";

const startDate = create("input");
startDate.className = "dateInput"
startDate.setAttribute("type", "date");
startDate.setAttribute("id", "startDate");
const endDate = create("input");
endDate.className = "dateInput";
endDate.setAttribute("type", "date");
endDate.setAttribute("id", "endDate");

// Money related
const money = create("div");
money.className = "moneyDiv";
const allMoney = create("div");
allMoney.className = "allMoney";

const moneyNet = create("div");
moneyNet.className = "moneyNet";
moneyNet.innerHTML = "<span class='heading'>Total (Net)</span><div id='netPrice' class='priceTag'>100лв.</div>"

const moneyGross = create("div");
moneyGross.className = "moneyGross";
moneyGross.innerHTML = "<span class='heading'>Total (Gross)</span><div id='grossPrice' class='priceTag'>100лв.</div>"

const moneyExpenses = create("div");
moneyExpenses.className = "moneyExpenses";
moneyExpenses.innerHTML = "<span class='heading'>Expenses</span><div id='expensesPrice' class='priceTag'>100лв.</div>"

const additionalMoneyInformation = create("div");
additionalMoneyInformation.className = "additionalMoneyInformation";

const tableHeadMonthlyTables = create("thead");
tableHeadMonthlyTables.className = "tableHeadMonthlyTables"
const tableHeadMonthlyTablesProperties = `
<tr class="tableHeadRow">
    <th>#</th>
    <th>Team Name</th>
    <th>Date</th>
    <th>Time</th>
    <th>Money</th>
    <th>Operators</th>
    <th>Game Mode</th>
    <th>Language</th>
    <th>Discount</th>
</tr>
`
tableHeadMonthlyTables.innerHTML = tableHeadMonthlyTablesProperties;

const editDates = create("i");
editDates.className = "editDates fas fa-pen-square";

let spanPrime = span.cloneNode(true);
todaysMonth.append(spanPrime);
spanPrime.append(startDate);
spanPrime.append(endDate);
spanPrime.append(editDates);

// Additional Money Information (Operators, Expenses)
const container = create("div");
container.className = "container";
const operators = create("div");
operators.className = "operators";
const expenses = create("div");
expenses.className = "expenses";
const itemTextInput = create("input");
itemTextInput.className = "itemTextInput";
itemTextInput.setAttribute("placeholder", "Разход");
const itemPriceInput = create("input");
itemPriceInput.className = "itemPriceInput";
itemPriceInput.setAttribute("placeholder", "Цена");
const itemAdd = create("button");
itemAdd.className = "itemAdd";
itemAdd.innerHTML = '<i class="fas fa-plus-circle"></i>';
const expensesItems = create("div");
expensesItems.className = "expensesItems";
const expensesAddItem = create("div");
expensesAddItem.className = "expensesAddItem";

expensesAddItem.append(itemTextInput);
expensesAddItem.append(itemPriceInput);
expensesAddItem.append(itemAdd);

expenses.append(expensesItems)
expenses.append(expensesAddItem)


container.append(operators);
container.append(expenses);

for (let i = 0; i < allOperators.length; i++) {
    const operator = create("div");
    operator.className = "operator";
    const operatorColor = create("span");
    operatorColor.className = "color";
    const operatorName = create("span");
    operatorName.className = "name";
    const operatorTotalGroups = create("span");
    operatorTotalGroups.className = "totalGroups";
    const operatorTotalMoney = create("span");
    operatorTotalMoney.className = "totalMoney";
    
    operators.append(operator);
    operator.append(operatorColor);
    operator.append(operatorName);
    operator.append(operatorTotalMoney);
    operator.append(operatorTotalGroups);
    operatorName.textContent = allOperators[i];
}

const loadDataMonthlyTables = (data) => {
    body.append(content);
    content.append(monthlyTablesDiv);
    startDate.setAttribute("readonly", "");
    endDate.setAttribute("readonly", "");
    todaysMonth.prepend(todaysMonthText);
    todaysMonthText.append(todaysMonthTextCurrentMonth)
    todaysMonthText.append(todaysMonthTextAllMonths);
    monthlyTablesDiv.append(money);
    money.append(todaysMonth);
    money.append(allMoney);
    allMoney.append(moneyNet);
    allMoney.append(moneyGross);
    allMoney.append(moneyExpenses);
    allMoney.append(additionalMoneyInformation);
    additionalMoneyInformation.append(container);

    // REMOVE THE FUCKING COMMA, THAT FIREBASE ARRAY IS CREATING AFTER EACH ELEMENT, FUCK SHIT GAY BITCH
    for (let i = 0; i < document.querySelector(".expensesItems").childNodes.length; i++) {
        if (document.querySelector(".expensesItems").childNodes[i].textContent == ",") {
            document.querySelector(".expensesItems").childNodes[i].textContent = ""
        }
    }

    document.querySelectorAll(".itemPrice").forEach(element => {
        if (parseInt(element.textContent) > 100) {
            element.previousElementSibling.previousElementSibling.previousElementSibling.style.backgroundColor = "#be0000";
        } else {
            element.previousElementSibling.previousElementSibling.previousElementSibling.style.backgroundColor = "#3ad17e";
        }
            
        if (parseInt(element.textContent) == 0) {
            element.parentNode.parentNode.removeChild(element.parentNode);
        }
    });
    
    monthlyTablesDiv.append(table);
    table.append(tableHeadMonthlyTables);
    table.append(tableBody);

    let html = '';
    let i = 0;

    data.forEach(doc => {
        const reservation = doc.data();
        if(reservation.status == '<i class="fas fa-check-circle confirmation"></i>') {
            i++;
            const tr = `
        <tr class="reservations" data-id="${reservation.booking}">
            <td class="monthlyTables">${i}</td>
            <td class="monthlyTables"><input type="text" class="editInputTeamNameCurrent" value="${reservation.teamname}"></td>
            <td class="monthlyTables">${new Date(reservation.booking).toLocaleDateString('en-GB', {timeZone: 'UTC', month: '2-digit', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: "h23" })}</td>
            <td class="monthlyTables"><input type="text" class="editInputTimeInRoom" value="${reservation.timeInRoom}"></td>
            <td class="monthlyTables"><input type="text" class="editInputMoneyCurrent" value="${reservation.money}">лв. (<input type="text" class="editInputPeopleCurrent" value="${reservation.people}">)</td>
            <td class="monthlyTables">${reservation.firstOperator} ${reservation.secondOperator} ${reservation.operatorReload}</td>
            <td class="monthlyTables"><input type="text" class="editInputGameModeCurrent" readonly value="${reservation.gamemode}"></td>
            <td class="monthlyTables"><input type="text" class="editInputLanguageCurrent" readonly value="${reservation.language}"></td>
            <td class="monthlyTables"><input type="text" class="editInputDiscountCurrent" readonly value="${reservation.discount}"></td>
        </tr>
        `
        html += tr;
        }
    })
    tableBody.innerHTML = html;

    // Count all groups and money
    let groupsCounter = [1, 1, 1];
    let moneyCounter = [0, 0, 0];
    let moneyFromGroup = 20;
    let operatorColors = ["#800080", "#4a90e2", "#39caba"];
    
    // Default values for money and groups
    document.querySelectorAll(".totalGroups")[0].textContent = "0 групи";
    document.querySelectorAll(".totalGroups")[1].textContent = "0 групи";
    document.querySelectorAll(".totalGroups")[2].textContent = "0 групи";
    document.querySelectorAll(".totalMoney")[0].textContent = "0";
    document.querySelectorAll(".totalMoney")[1].textContent = "0";
    document.querySelectorAll(".totalMoney")[2].textContent = "0";
    
    document.querySelectorAll(".operatorText").forEach((element) => {
        for (let p = 0; p < allOperators.length; p++) {
            document.querySelectorAll(".color")[p].style.backgroundColor = operatorColors[p];
            if (element.textContent == allOperators[p]) {
                document.querySelectorAll(".totalGroups")[p].textContent = `${groupsCounter[p]++} групи`;
                document.querySelectorAll(".totalMoney")[p].textContent = `${moneyCounter[p] = moneyCounter[p] + moneyFromGroup}`;

                if (document.querySelectorAll(".totalGroups")[p].textContent == "1 групи") {
                    document.querySelectorAll(".totalGroups")[p].textContent = "1 група";
                }
            }
        }
    })

    let allMoneyFromGroups = parseInt(document.querySelectorAll(".totalMoney")[0].textContent) + 
                             parseInt(document.querySelectorAll(".totalMoney")[1].textContent) +
                             parseInt(document.querySelectorAll(".totalMoney")[2].textContent);

    // If a group is Added or Deleted - Make new instance of Salaries
    sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayRemove(`<div class="item"><span class="itemColor"></span><span class="itemText">Заплати</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${allMoneyFromGroups + moneyFromGroup}</span></div>`)});
    sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayRemove(`<div class="item"><span class="itemColor"></span><span class="itemText">Заплати</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${allMoneyFromGroups + (moneyFromGroup * 2)}</span></div>`)});
    sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayRemove(`<div class="item"><span class="itemColor"></span><span class="itemText">Заплати</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${allMoneyFromGroups - moneyFromGroup}</span></div>`)});
    sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayRemove(`<div class="item"><span class="itemColor"></span><span class="itemText">Заплати</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${allMoneyFromGroups - (moneyFromGroup * 2)}</span></div>`)});
    sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayRemove(`<div class="item"><span class="itemColor"></span><span class="itemText">Заплати</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">0</span></div>`)});
    sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayUnion(`<div class="item"><span class="itemColor"></span><span class="itemText">Заплати</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${allMoneyFromGroups}</span></div>`)});
    
    // Delete element from "Expenses" array
    document.querySelectorAll(".itemDelete").forEach(element => {
        element.addEventListener("click", function() {
            element.parentNode.style.display = "none";
            sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayRemove(`<div class="item"><span class="itemColor"></span><span class="itemText">${element.previousElementSibling.textContent}</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${element.nextElementSibling.textContent}</span></div>`)});
        })
    })

    // Add element to "Expenses" array
    document.querySelector(".itemAdd").addEventListener("click", function() {
        if(document.querySelector(".itemTextInput").value !== "" && document.querySelector(".itemPriceInput").value !== "") {
            sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayUnion(`<div class="item"><span class="itemColor"></span><span class="itemText">${document.querySelector(".itemTextInput").value}</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${parseInt(document.querySelector(".itemPriceInput").value)}</span></div>`)});
            document.querySelector(".itemTextInput").value = "";
            document.querySelector(".itemPriceInput").value = "";
            setTimeout(() => {
                sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).get().then(function(doc){
                    document.querySelector(".expensesItems").innerHTML = doc.data().expenses;
                    for (let i = 0; i < document.querySelector(".expensesItems").childNodes.length; i++) {
                        if (document.querySelector(".expensesItems").childNodes[i].textContent == ",") {
                            document.querySelector(".expensesItems").childNodes[i].textContent = ""
                        }
                    }

                    document.querySelectorAll(".itemPrice").forEach(element => {
                        if (parseInt(element.textContent) > 100) {
                            element.previousElementSibling.previousElementSibling.previousElementSibling.style.backgroundColor = "#be0000";
                        } else {
                            element.previousElementSibling.previousElementSibling.previousElementSibling.style.backgroundColor = "#3ad17e";
                        }
                            
                        if (parseInt(element.textContent) == 0) {
                            element.parentNode.parentNode.removeChild(element.parentNode);
                        }
                    });
                })
            }, 500);
        }
    })
    
    // Make editing dates available
    document.querySelector(".editDates").addEventListener("click", function() {
        startDate.removeAttribute("readonly");
        endDate.removeAttribute("readonly");
    })

    document.querySelector("#startDate").addEventListener("change", function() {
        sawroomDB.collection("months").doc(this.parentNode.previousSibling.childNodes[0].textContent.replace(/\s+/g, '').toLowerCase()).update({startDate: new Date(this.value).getTime()})
    })

    document.querySelector("#endDate").addEventListener("change", function() {
        sawroomDB.collection("months").doc(document.querySelector("#endDate").parentNode.previousSibling.childNodes[0].textContent.replace(/\s+/g, '').toLowerCase()).update({endDate: new Date(this.value).getTime()})
    })

    // When editing a date, instantly change it in the db

    // Loop for money count
    const allReservations = document.querySelectorAll(".reservations");
    const allExpenses = document.querySelectorAll(".item");
    let netPrice = 0;
    let expensesPrice = 0;
    for (let i = 0; i < allReservations.length; ++i) {
        netPrice = netPrice + parseInt(document.querySelectorAll(".editInputMoneyCurrent")[i].value);
    }

    for (let i = 0; i < allExpenses.length; i++) {
        expensesPrice += parseInt(allExpenses[i].lastElementChild.textContent);
    }

    element("#netPrice").textContent = `${netPrice}лв.`;
    element("#grossPrice").textContent = `${netPrice - expensesPrice}лв.`;
    element("#expensesPrice").textContent = `${expensesPrice}лв.`;


    // Edit on key up inputs
    document.querySelectorAll(".editInputTeamNameCurrent").forEach(element => {
        element.addEventListener("keyup", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            docRef.update({teamname: element.value});
        })
    })
    document.querySelectorAll("#op1").forEach(element => {
        element.addEventListener("click", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.parentNode.getAttribute("data-id"));
            element.setAttribute("selected", "selected");
            docRef.update({firstOperator: `<span class="operatorText">${element.value}</span>`} )
        })
    })
    document.querySelectorAll("#op2").forEach(element => {
        element.addEventListener("click", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.parentNode.getAttribute("data-id"));
            element.setAttribute("selected", "selected");
            docRef.update({secondOperator: `<span class="operatorText">${element.value}</span>`})
        })
    })
    document.querySelectorAll(".operatorReload").forEach(element => {
        element.addEventListener("click", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            docRef.update(
                {
                    firstOperator: firstOperator,
                    secondOperator: secondOperator
                })
                setTimeout(() => {
                    document.location.reload();
                }, 500);
        })
    })
    document.querySelectorAll(".editInputTimeInRoom").forEach(element => {
        element.addEventListener("keyup", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            docRef.update({timeInRoom: element.value});
        })
    })
    document.querySelectorAll(".editInputMoneyCurrent").forEach(element => {
        element.addEventListener("keyup", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            docRef.update({money: element.value});
        })
    })
    document.querySelectorAll(".editInputPeopleCurrent").forEach(element => {
        element.addEventListener("keyup", function() {
            const docRef = sawroomDB.collection("reservationsSecure").doc(element.parentNode.parentNode.getAttribute("data-id"));
            docRef.update({people: element.value});
        })
    })
}

const loadDataVouchers = (data) => {
}
