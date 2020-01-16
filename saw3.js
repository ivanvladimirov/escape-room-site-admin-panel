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
let todaysDate = new Date(st);
todaysDate.setHours(0,0,0,0);

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
vouchers.className = "vouchers hidden";
const dashboard = create("a");
dashboard.innerHTML = '<i class="fas fa-users"></i> All Groups';
dashboard.setAttribute('href', '#');
dashboard.className = "dashboard";
const monthlyTables = create("a");
monthlyTables.innerHTML = '<i class="fas fa-table"></i> Tables'
monthlyTables.setAttribute('href', '#');
monthlyTables.className = "tables";
const calendar = create("a");
calendar.innerHTML = '<i class="fas fa-calendar-alt"></i> Calendar';
calendar.setAttribute('href', "#");
calendar.className = "calendar";
const schedule = create("a");
schedule.innerHTML = '<i class="fas fa-clock"></i> Schedule';
schedule.setAttribute('href', '#');
schedule.className = "schedule hidden";
const allGroups = create("a");
allGroups.innerHTML = '<i class="fas fa-columns"></i> Dashboard';
allGroups.setAttribute('href', '#');
allGroups.className = "allGroups selected";

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
    dashboardDiv.append(input);
    dashboardDiv.append(table);
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
            const privateDocRefFullYear = sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString());
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
                    privateDocRefFullYear.update({
                        allReservations: firebase.firestore.FieldValue.arrayRemove({
                            name: element.parentNode.parentNode.children[2].children[0].value,
                            phone: element.parentNode.parentNode.children[3].children[0].children[0].value,
                            email: element.parentNode.parentNode.children[5].children[0].value,
                            people: element.parentNode.parentNode.children[4].children[0].value,
                            money: parseInt(element.parentNode.parentNode.children[4].children[1].value),
                            teamname: element.parentNode.parentNode.children[6].children[0].value,
                            language: element.parentNode.parentNode.children[9].children[0].value,
                            discount: element.parentNode.parentNode.children[10].children[0].value,
                            gamemode: element.parentNode.parentNode.children[7].children[0].value,
                            booking: parseInt(element.parentNode.parentNode.getAttribute("data-id"))
                        })
                    })
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
            const privateDocRefFullYear = sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString());

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    const reservation = doc.data();

                    function confirmEditBooking() {
                        this.parentNode.parentNode.classList.remove("editing");
                        this.setAttribute("id", "editBooking");
                        docRef.delete();
                        privateDocRef.delete();
                        privateDocRefFullYear.update({
                            allReservations: firebase.firestore.FieldValue.arrayRemove({
                                name: reservation.name,
                                phone: reservation.phone,
                                email: reservation.email,
                                people: reservation.people,
                                money: reservation.money,
                                teamname: reservation.teamname,
                                language: reservation.language,
                                discount: reservation.discount,
                                gamemode: reservation.gamemode,
                                booking: reservation.booking
                            })
                        })
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
                            fake: false,
                            status: reservation.status,
                            madeOn: reservation.madeOn,
                            firstOperator: firstOperator,
                            secondOperator: secondOperator,
                            timeInRoom: "00:00:00",
                            operatorReload: `<i class="operatorReload fas fa-redo"></i>`,
                            buttons: '<i id="editBooking" class="fas fa-pen"><span>Edit</span></i><i id="deleteBooking" class="fas fa-minus-square"><span>Delete</span></i>'
                        })
                        privateDocRefFullYear.update({
                            allReservations: firebase.firestore.FieldValue.arrayUnion({
                                name: document.querySelector(".editInputName").value,
                                phone: document.querySelector(".editInputPhone").value,
                                email: document.querySelector(".editInputEmail").value,
                                people: document.querySelector(".editInputPeople").value,
                                money: document.querySelector(".editInputMoney").value,
                                teamname: document.querySelector(".editInputTeamName").value,
                                language: document.querySelector(".editInputLanguage").value,
                                discount: document.querySelector(".editInputDiscount").value,
                                gamemode: document.querySelector(".editInputGameMode").value,
                                booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000
                            })
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
                        setTimeout(() => {
                            document.location.reload();
                        }, 500);
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
moneyNet.innerHTML = "<span class='heading'>Total (Net)</span><div id='netPrice' class='priceTag'></div>"

const moneyGross = create("div");
moneyGross.className = "moneyGross";
moneyGross.innerHTML = "<span class='heading'>Total (Gross)</span><div id='grossPrice' class='priceTag'></div>"

const moneyExpenses = create("div");
moneyExpenses.className = "moneyExpenses";
moneyExpenses.innerHTML = "<span class='heading'>Expenses</span><div id='expensesPrice' class='priceTag'></div><div class='comparison expensesSalaries'></div>"

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
    body.append(monthlyTablesDiv);
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

    tableBody.parentNode.style.display = "table";

    data.forEach(doc => {
        const reservation = doc.data();
        if(reservation.status == '<i class="fas fa-check-circle confirmation"></i>') {
            i++;
            const tr = `
        <tr class="reservations" data-id="${reservation.booking}">
            <td>${i}</td>
            <td><input type="text" class="editInputTeamNameCurrent" value="${reservation.teamname}"></td>
            <td>${new Date(reservation.booking).toLocaleDateString('en-GB', {timeZone: 'UTC', month: '2-digit', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: "h23" })}</td>
            <td><input type="text" class="editInputTimeInRoom" value="${reservation.timeInRoom}"></td>
            <td><input type="text" class="editInputMoneyCurrent" value="${reservation.money}">лв. (<input type="text" class="editInputPeopleCurrent" value="${reservation.people}">)</td>
            <td>${reservation.firstOperator} ${reservation.secondOperator} ${reservation.operatorReload}</td>
            <td><input type="text" class="editInputGameModeCurrent" readonly value="${reservation.gamemode}"></td>
            <td><input type="text" class="editInputLanguageCurrent" readonly value="${reservation.language}"></td>
            <td><input type="text" class="editInputDiscountCurrent" readonly value="${reservation.discount}"></td>
        </tr>
        `
        html += tr;
        }
    })
    tableBody.innerHTML = html;

    // Missing Code

    // Missing Code
    
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
    
    // Count salaries
    document.querySelector(".expensesSalaries").innerHTML = `Заплати: ${moneyFromGroup * document.querySelectorAll(".operatorText").length}лв.`;

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
            sawroomDB.collection("months").doc(document.querySelector(".currentMonth").textContent.replace(/\s+/g, '').toLowerCase()).update({expenses:firebase.firestore.FieldValue.arrayUnion(`<div class="item"><span class="itemColor"></span><span class="itemText">${document.querySelector(".itemTextInput").value} - ${new Date().toLocaleDateString('en-GB',{ year: '2-digit', month: 'numeric', day: 'numeric' })}</span><span class="itemDelete"><i class="fas fa-trash"></i></span><span class="itemPrice">${parseInt(document.querySelector(".itemPriceInput").value)}</span></div>`)});
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

    let expensesAndSalaries = expensesPrice + (moneyFromGroup * document.querySelectorAll(".operatorText").length);

    element("#netPrice").textContent = `${netPrice}лв.`;
    element("#grossPrice").textContent = `${netPrice - expensesAndSalaries}лв.`;
    element("#expensesPrice").textContent = `${expensesAndSalaries}лв.`;


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

const h5 = create("h5");
h5.setAttribute("style", "animation: 1.4s appearing ease-in-out;opacity: 0;animation-fill-mode: forwards;")
h5.innerHTML = `Groups To Confirm For ${new Intl.DateTimeFormat('en-GB', {day: "numeric", month: "numeric"}).format(new Date())} And ${new Intl.DateTimeFormat('en-GB', {day: "numeric", month: "numeric"}).format(new Date().setDate(new Date().getDate() + 1))}`;
const messages = create("div");
messages.className = "messages";
const twoColumnsDiv = create("div");
twoColumnsDiv.className = "twoColumnsDiv";
const tasksDiv = create("div");
tasksDiv.className = "tasksDiv";
const tasks = create("div");
tasks.className = "tasks";
const unfinishedTasks = create("div");
unfinishedTasks.className = "unfinishedTasks";
const finishedTasks = create("div");
finishedTasks.className = "finishedTasks";
const finishedTasksHeading = create("h4");
finishedTasksHeading.textContent = "Finished Tasks";
const unfinishedTasksHeading = create("h4");
unfinishedTasksHeading.innerHTML = `Unfinished Tasks`;
const addTask = create("button");
addTask.innerHTML = `<i title="Add A Task" class="addTask fas fa-plus-circle"></i>`
const tasksHeading = create("h5");
tasksHeading.innerHTML = "Tasks"
const tasksTable = create("table");
tasksTable.className = "tasksTable";

const chartDiv = create("div");
chartDiv.className = "chartDiv";
const chartHeading = create("h5");
chartHeading.textContent = `All groups for ${new Date().getFullYear()}`;
const chart = create("div");
chart.className = "chart allGroupsThisYear";
chart.innerHTML = `<div class="content"><canvas id="myChart"></canvas></div>`

const allGroupsDiv = create("div");
allGroupsDiv.className = "allGroupsDiv";
const tableHeadAllGroups = create("thead");
const tableHeadAllGroupsProperties = `
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

const loadDataAllGroups = (data) => {
    // WORK WITH THIS!!!
    // let pushed = [];
    // const something = document.querySelector(".something");
    // const something2 = document.querySelector(".something2");
    // let someDivs = "";
    // const array = document.querySelectorAll(".array");

    // sawroomDB.collection("reservationsSecure").doc(todaysDate.getFullYear().toString()).get().then(function(doc) {
    //     for(let i = 0; i < doc.data().allReservations.length; i++) {
    //         something.innerHTML = doc.data().allReservations[i].booking;
    //         const div = `<div class="array" id="${doc.data().allReservations[i].booking}">${doc.data().allReservations[i].booking}</div>`
            
    //         someDivs += div;
    //     }
    //     something.innerHTML = someDivs;

    //     array.forEach(function(element) {
    //         pushed.push(parseInt(element.id))
    //     })
    //     pushed.sort(function(a, b){return b-a});
    //     something2.innerHTML = pushed;
    // })

    tableHeadAllGroups.innerHTML = tableHeadAllGroupsProperties;

    body.append(allGroupsDiv);
    allGroupsDiv.append(messages);
        
    allGroupsDiv.append(h5);
    allGroupsDiv.append(table);
    table.append(tableHeadAllGroups);
    table.append(tableBody);

    // Tasks
    allGroupsDiv.append(twoColumnsDiv);
    twoColumnsDiv.append(tasksDiv);
    tasksDiv.append(tasksHeading);
    tasksDiv.append(tasks);
    tasks.append(unfinishedTasks);
    tasks.append(finishedTasks);

    // Chart
    twoColumnsDiv.append(chartDiv);
    chartDiv.append(chartHeading);
    chartDiv.append(chart);

        var chartMonths = [];
        var chartGroups = [];

        sawroomDB.collection("months").orderBy("startDate", "asc").get().then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {

                if (doc.id == `january${new Date().getFullYear()}`) {
                    chartMonths.splice(0, 1, "January");
                    chartGroups.splice(0, 1, doc.data().groups)
                }
                if (doc.id == `february${new Date().getFullYear()}`) {
                    chartMonths.splice(1, 1, "February");
                    chartGroups.splice(1, 1, doc.data().groups)
                }
                if (doc.id == `march${new Date().getFullYear()}`) {
                    chartMonths.splice(2, 1, "March");
                    chartGroups.splice(2, 1, doc.data().groups)
                }
                if (doc.id == `april${new Date().getFullYear()}`) {
                    chartMonths.splice(3, 1, "April");
                    chartGroups.splice(3, 1, doc.data().groups)
                }
                if (doc.id == `may${new Date().getFullYear()}`) {
                    chartMonths.splice(4, 1, "May");
                    chartGroups.splice(4, 1, doc.data().groups)
                }
                if (doc.id == `june${new Date().getFullYear()}`) {
                    chartMonths.splice(5, 1, "June");
                    chartGroups.splice(5, 1, doc.data().groups)
                }
                if (doc.id == `july${new Date().getFullYear()}`) {
                    chartMonths.splice(6, 1, "July");
                    chartGroups.splice(6, 1, doc.data().groups)
                }
                if (doc.id == `august${new Date().getFullYear()}`) {
                    chartMonths.splice(7, 1, "August");
                    chartGroups.splice(7, 1, doc.data().groups)
                }
                if (doc.id == `september${new Date().getFullYear()}`) {
                    chartMonths.splice(8, 1, "September");
                    chartGroups.splice(8, 1, doc.data().groups)
                }
                if (doc.id == `october${new Date().getFullYear()}`) {
                    chartMonths.splice(9, 1, "October");
                    chartGroups.splice(9, 1, doc.data().groups)
                }
                if (doc.id == `november${new Date().getFullYear()}`) {
                    chartMonths.splice(10, 1, "November");
                    chartGroups.splice(10, 1, doc.data().groups)
                }
                if (doc.id == `december${new Date().getFullYear()}`) {
                    chartMonths.splice(11, 1, "December");
                    chartGroups.splice(11, 1, doc.data().groups)
                }

                var ChartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                        layout:{padding:{top:12,left:12,bottom:12,},},
                         scales: {
                        xAxes:[{
                    gridLines:{borderDash:[],},
                    }],
                    
                        yAxes:[{
                    gridLines:{borderDash:[],},
                    }],
                     },plugins:{
                    datalabels:{display:true,
                        color:'#ffffff',
                        anchor:'start',
                        align:'end',
                        offset:17,
                        font:{
                            style:' bold',},},
                    },
                    legend:{
                        labels:{
                            generateLabels: function(chart){
                                 return  chart.data.datasets.map( function( dataset, i ){
                                    return{
                                        text:dataset.label,
                                        lineCap:dataset.borderCapStyle,
                                        lineDash:[],
                                        lineDashOffset: 0,
                                        lineJoin:dataset.borderJoinStyle,
                                        fillStyle:dataset.backgroundColor,
                                        strokeStyle:dataset.borderColor,
                                        lineWidth:dataset.pointBorderWidth,
                                        lineDash:dataset.borderDash,
                                    }
                                })
                            },
                    
                        },
                    },
                    elements: {
                        arc: {
                    },
                        point: {radius:4,borderWidth:3,},
                        line: {tension:0.5,
                    },
                        rectangle: {
                    },
                    },
                    tooltips:{
                    },
                    hover:{
                        mode:'nearest',
                        animationDuration:400,
                    },
                    };
            
                    var ChartData = {
                    
                        labels : chartMonths,
                        datasets : [
                            {
                            data : chartGroups,
                            backgroundColor :'#f51d45',
                            borderColor : 'rgba(255,255,255,0.00)',
                            pointBackgroundColor:'#f51d45',
                            pointBorderColor : '#232228',
                            label: `All groups for ${new Date().getFullYear()}`}
                    ]
                    };
            
                var ctx = document.getElementById('myChart');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: ChartData,
                    options: ChartOptions
                });
            })
            // querySnapshot.docs.forEach(doc => {chartMonths.push(doc.data().groups)})
        })

    let todaysReservations = '';
    data.forEach(doc => {
        const reservation = doc.data();
        if(reservation.status == '<i class="fas fa-minus-circle confirmation"></i>' && todaysDateNow + 10800000 < reservation.booking) {
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
            todaysReservations += tr;
        }
    })

        tableBody.innerHTML = todaysReservations;
        if (tableBody.innerHTML == "") {
            tableBody.parentNode.style.display = "none";
            tableBody.parentNode.previousElementSibling.innerHTML = `No Groups To Confirm For ${new Intl.DateTimeFormat('en-GB', {day: "numeric", month: "numeric"}).format(new Date())} And ${new Intl.DateTimeFormat('en-GB', {day: "numeric", month: "numeric"}).format(new Date().setDate(new Date().getDate() + 1))}`;
        }

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
                    element.parentNode.parentNode.style.display = "none";
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
            const privateDocRefFullYear = sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString());
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
                    privateDocRefFullYear.update({
                        allReservations: firebase.firestore.FieldValue.arrayRemove({
                            name: element.parentNode.parentNode.children[2].children[0].value,
                            phone: element.parentNode.parentNode.children[3].children[0].children[0].value,
                            email: element.parentNode.parentNode.children[5].children[0].value,
                            people: element.parentNode.parentNode.children[4].children[0].value,
                            money: parseInt(element.parentNode.parentNode.children[4].children[1].value),
                            teamname: element.parentNode.parentNode.children[6].children[0].value,
                            language: element.parentNode.parentNode.children[9].children[0].value,
                            discount: element.parentNode.parentNode.children[10].children[0].value,
                            gamemode: element.parentNode.parentNode.children[7].children[0].value,
                            booking: parseInt(element.parentNode.parentNode.getAttribute("data-id"))
                        })
                    })
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
            const privateDocRefFullYear = sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString());

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    const reservation = doc.data();

                    function confirmEditBooking() {
                        this.parentNode.parentNode.classList.remove("editing");
                        this.setAttribute("id", "editBooking");
                        docRef.delete();
                        privateDocRef.delete();
                        privateDocRefFullYear.update({
                            allReservations: firebase.firestore.FieldValue.arrayRemove({
                                name: reservation.name,
                                phone: reservation.phone,
                                email: reservation.email,
                                people: reservation.people,
                                money: reservation.money,
                                teamname: reservation.teamname,
                                language: reservation.language,
                                discount: reservation.discount,
                                gamemode: reservation.gamemode,
                                booking: reservation.booking
                            })
                        })
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
                            fake: false,
                            status: reservation.status,
                            madeOn: reservation.madeOn,
                            firstOperator: firstOperator,
                            secondOperator: secondOperator,
                            timeInRoom: "00:00:00",
                            operatorReload: `<i class="operatorReload fas fa-redo"></i>`,
                            buttons: '<i id="editBooking" class="fas fa-pen"><span>Edit</span></i><i id="deleteBooking" class="fas fa-minus-square"><span>Delete</span></i>'
                        })
                        privateDocRefFullYear.update({
                            allReservations: firebase.firestore.FieldValue.arrayUnion({
                                name: document.querySelector(".editInputName").value,
                                phone: document.querySelector(".editInputPhone").value,
                                email: document.querySelector(".editInputEmail").value,
                                people: document.querySelector(".editInputPeople").value,
                                money: document.querySelector(".editInputMoney").value,
                                teamname: document.querySelector(".editInputTeamName").value,
                                language: document.querySelector(".editInputLanguage").value,
                                discount: document.querySelector(".editInputDiscount").value,
                                gamemode: document.querySelector(".editInputGameMode").value,
                                booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000
                            })
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
                        setTimeout(() => {
                            document.location.reload();
                        }, 500);
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
}

const calendarDiv = create("div");
calendarDiv.className = "calendarDiv";

const loadDataCalendar = (data) => {
    body.append(calendarDiv);
    calendarDiv.innerHTML = 
    `
    <div class="reservation">
    <div class="calendarTable">
        <div class="buttonSection">
            <button class="enableBlocking">Enable Blocking</button>
            <button class="deleteBlocking">Delete Blocking</button>
        </div>
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <div class="prevWeek arrow" href="#"><i class="fas fa-angle-left"></i></div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="day">
            <div class="weekDay"></div>
            <div class="date"></div>
            <div class="hours">
                <div class="hour"></div>
                <div class="hour"></div>
                <div class="hour"></div>
            </div>
        </div>
        <div class="nextWeek arrow" href="#"><i class="fas fa-angle-right"></i></div>
    </div>
    </div>`
    // All the times are in milliseconds
    // How much is the gap between the hours
    const gapBetweenNextHour = 8100000;
    // When is the first hour
    const firstHour = 61200000;

    function msToHours(duration) {
        let minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;

        return hours + ":" + minutes;
    }

    // When is the last hour
    const lastHourInLocale = msToHours(77400000); // Change this and "lastHour" respectively
    const lastHour = 77400000;

    // Calendar Content
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

    let todaysDate = new Date(st);
    todaysDate.setUTCHours(0,0,0,0);

    // Week Days Renaming
    let weekDay = new Array(7);
    weekDay[0] = "Неделя";
    weekDay[1] = "Понеделник";
    weekDay[2] = "Вторник";
    weekDay[3] = "Сряда";
    weekDay[4] = "Четвъртък";
    weekDay[5] = "Петък";
    weekDay[6] = "Събота";

    // Date Formatting
    let DD = todaysDate.getUTCDate(),
        MM = todaysDate.getUTCMonth() + 1,
        YYYY = todaysDate.getUTCFullYear();

    // Selector based functions minify
    function element(selector) {
        return document.querySelector(selector);
    }

    // Day Declarations
    let startDate = element(".date").textContent = `${DD}/${MM}/${YYYY}`;
    let allWeekDays = document.querySelectorAll(".weekDay");
    let allDates = document.querySelectorAll(".date");
    let newWeek = -1;

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getUTCDate();
    }

    // All the times are in milliseconds!
    let oneDay = 86400000; //24 Hours

    // Block front-end hours after that time
    const sameDayHours = 0; // Currently 0 hours

    let hoursIncrement = 0;
    let newWeekHours = 604800000;
    let todaysDatePlusFirstHour = todaysDate.getTime() + firstHour - gapBetweenNextHour;

    let allHoursDiv = document.querySelectorAll(".hours");

    // Display all weekdays and dates
    let datesIncrement = 0;
    let todaysDateNow = new Date(st).getTime();

    for (let i = 0; i < allDates.length; i++) {
        // Set "data-day" to know if it's a weekend day
        let nextDay = todaysDate.getUTCDay() + i;
        
        if (nextDay == 0) {
            nextDay = 7;
        }

        allHoursDiv[i].setAttribute("data-day", nextDay);

        if (nextDay > 7) {
            newWeek++;
            allWeekDays[i].textContent = weekDay[newWeek];
        };

        // Dates
        datesIncrement += oneDay;
        let dates = todaysDateNow + datesIncrement - oneDay;
        allDates[i].textContent = new Date(dates).toLocaleDateString('en-GB', {timeZone: 'UTC'});
        allWeekDays[i].textContent = new Date(dates).toLocaleDateString('bg-BG', {timeZone: 'UTC', weekday: 'long'});

        element(".nextWeek").addEventListener("click", function() {
            dates = dates + newWeekHours;
            allDates[i].textContent = new Date(dates).toLocaleDateString('en-GB', {timeZone: 'UTC'});
        });

        element(".prevWeek").addEventListener("click", function() {
            dates = dates - newWeekHours;
            allDates[i].textContent = new Date(dates).toLocaleDateString('en-GB', {timeZone: 'UTC'});
        });
    }

    // weekendHoursFirst.classList.add("hour");
    // weekendHoursSecond.classList.add("hour");
    // document.querySelector('.hours[data-day=\"7\"').prepend(weekendHoursSecond);
    // document.querySelector('.hours[data-day=\"7\"').prepend(weekendHoursFirst);

    let weekendHourSaturdayDiv = document.createElement("div");
    let weekendHourSundayDiv = document.createElement("div");
    weekendHourSaturdayDiv.classList.add("hour");
    weekendHourSundayDiv.classList.add("hour");

    var allHours = document.querySelectorAll(".hour");

    let saturday = document.querySelector('.hours[data-day=\"6\"');
    let sunday = document.querySelector('.hours[data-day=\"7\"');

    for (let i = 0; i < allHours.length; i++) {
        hoursIncrement += gapBetweenNextHour;
        let hours = todaysDatePlusFirstHour + hoursIncrement;
        allHours[i].textContent = msToHours(hours);
        allHours[i].setAttribute("data-id", hours/1000);

        saturday.prepend(weekendHourSaturdayDiv);
        weekendHourSaturdayDiv.textContent = msToHours(parseInt(saturday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour);
        weekendHourSaturdayDiv.setAttribute("data-id", (parseInt(saturday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour)/1000)
        sunday.prepend(weekendHourSundayDiv);
        weekendHourSundayDiv.textContent = msToHours(parseInt(sunday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour);
        weekendHourSundayDiv.setAttribute("data-id", (parseInt(sunday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour)/1000)

        // Make every day with the same hours
        if(msToHours(hours) == lastHourInLocale) {
            hoursIncrement += 86400000 - (lastHour - firstHour + gapBetweenNextHour);
        }

        // If the hour has passed, assign class name "passed"
        if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > allHours[i].getAttribute("data-id")*1000) {
            allHours[i].className = "passed hour";
        }

        element(".nextWeek").addEventListener("click", function() {
            hours = hours + newWeekHours;
            // Change Hours
            // allHours[i].textContent = msToHours(hours);
            
            allHours[i].setAttribute("data-id", hours/1000);
            weekendHourSaturdayDiv.setAttribute("data-id", (parseInt(saturday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour)/1000)

            if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > weekendHourSaturdayDiv.getAttribute("data-id")*1000) {
                weekendHourSaturdayDiv.className = "passed";
            } 
            else {
                weekendHourSaturdayDiv.className = "hour"
            }
                
            weekendHourSundayDiv.setAttribute("data-id", (parseInt(sunday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour)/1000)

            if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > weekendHourSundayDiv.getAttribute("data-id")*1000) {
                weekendHourSundayDiv.className = "passed";
            }
            else{
                weekendHourSundayDiv.className = "hour"
            }

            if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > allHours[i].getAttribute("data-id")*1000) {
                allHours[i].className = "passed";
            } 
            else {
                allHours[i].className = "hour";
            }
        })

        element(".prevWeek").addEventListener("click", function() {
            hours = hours - newWeekHours;
            // Change Hours
            // allHours[i].textContent = msToHours(hours);
            allHours[i].setAttribute("data-id", hours/1000);
            weekendHourSaturdayDiv.setAttribute("data-id", (parseInt(saturday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour)/1000)
            
            if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > weekendHourSaturdayDiv.getAttribute("data-id")*1000) {
                weekendHourSaturdayDiv.className = "passed";
            } 
            else {
                weekendHourSaturdayDiv.className = "hour"
            }
            
            weekendHourSundayDiv.setAttribute("data-id", (parseInt(sunday.children[1].getAttribute("data-id"))*1000 - gapBetweenNextHour)/1000)

            if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > weekendHourSundayDiv.getAttribute("data-id")*1000) {
                weekendHourSundayDiv.className = "passed";
            }
            else{
                weekendHourSundayDiv.className = "hour"
            }
            
            if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > allHours[i].getAttribute("data-id")*1000) {
                allHours[i].className = "passed";
            }
            else {
                allHours[i].className = "hour";
            }
        })
    };

    if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > weekendHourSaturdayDiv.getAttribute("data-id")*1000) {
        weekendHourSaturdayDiv.className = "passed hour";
    }

    if ((new Date(st).getTime() + gapBetweenNextHour + sameDayHours) > weekendHourSundayDiv.getAttribute("data-id")*1000) {
        weekendHourSundayDiv.className = "passed hour";
    }

    // // Modal Content
    // document.querySelectorAll(".hour").forEach(element => {
    //     element.addEventListener("click", function() {
    //         document.querySelector(".closeButton").addEventListener("click", function() {
    //             document.querySelector(".modalR").style.display = "none";
    //             document.location.reload();
    //         })

    //         if (this.classList.contains("booked") || this.classList.contains("passed")) {
    //             document.querySelector(".modalR").style.display = "none";
    //         } else {
    //             let takenDate = parseInt(this.getAttribute("data-id")*1000);
    //             let now = new Date(st);

    //             people.addEventListener('change', function() {
    //                 if(people.value == 3) {
    //                     i = 0;
    //                 }
    //                 if(people.value == 4) {
    //                     i = 1;
    //                 }
    //                 if(people.value == 5) {
    //                     i = 2;
    //                 }
    //                 if(people.value == 6) {
    //                     i = 3;
    //                 }
                    
    //                 if(i < 2) {
    //                     document.querySelector("#gamemode").removeAttribute("disabled");
    //                 } else {
    //                     document.querySelector("#gamemode").setAttribute("disabled", "");
    //                     document.querySelector("#gamemode").value = "Hardcore";
    //                 }
    //             })

    //             document.querySelector(".modalR").style.display = "flex";
    //             document.querySelector(".takenDate").textContent = `${new Date(takenDate).toLocaleDateString('en-GB', {timeZone: 'UTC'})} в ${msToHours(takenDate)}`;
    //             document.querySelector(".dateHiddenInput").value = new Date(takenDate).toLocaleDateString('en-GB', {timeZone: 'UTC'});
    //             document.querySelector(".hourHiddenInput").value = msToHours(takenDate);
    //             const form = document.querySelector("form#reservation");
    //             form.addEventListener("submit", (e) => {
    //                 e.preventDefault();
    //                 var docRef = sawroomDB.collection("reservations").doc((parseInt(this.getAttribute("data-id"))*1000).toString());
    //                 var privateDocRef = sawroomDB.collection("reservationsSecure").doc((parseInt(this.getAttribute("data-id"))*1000).toString());
    //                 var privateDocRefFullYear = sawroomDB.collection("reservationsSecure").doc(todaysDate.getFullYear().toString());
    //                 docRef.get().then(function(doc) {
    //                     if (doc.exists) {
    //                         console.log("Reservation Exists");
    //                     } else 
    //                     if (new Intl.DateTimeFormat('en-GB',{timeZone: 'UTC', hour:'numeric',minute:'numeric'}).format(takenDate) !== "14:45" && 
    //                         new Intl.DateTimeFormat('en-GB',{timeZone: 'UTC', hour:'numeric',minute:'numeric'}).format(takenDate) !== "17:00" &&
    //                         new Intl.DateTimeFormat('en-GB',{timeZone: 'UTC', hour:'numeric',minute:'numeric'}).format(takenDate) !== "19:15" &&
    //                         new Intl.DateTimeFormat('en-GB',{timeZone: 'UTC', hour:'numeric',minute:'numeric'}).format(takenDate) !== "21:30") {
    //                         console.log("Ти май не си бял хакер? :(");
    //                     } else {
    //                         // doc.data() will be undefined in this case
    //                         docRef.set({
    //                             booking: takenDate
    //                         })

    //                         privateDocRef.set({
    //                             name: form.name.value,
    //                             phone: form.phone.value,
    //                             email: form.email.value,
    //                             people: form.people.value,
    //                             money: prices[i],
    //                             teamname: form.teamname.value,
    //                             language: form.language.value,
    //                             discount: form.discount.value,
    //                             gamemode: form.gamemode.value,
    //                             status: '<i class="fas fa-minus-circle confirmation"></i>',
    //                             madeOn: Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds(),now.getMilliseconds()),
    //                             booking: takenDate,
    //                             firstOperator: firstOperator,
    //                             secondOperator: secondOperator,
    //                             timeInRoom: "00:00:00",
    //                             operatorReload: `<i class="operatorReload fas fa-redo"></i>`,
    //                             buttons: '<i id="editBooking" class="fas fa-pen"><span>Edit</span></i><i id="deleteBooking" class="fas fa-minus-square"><span>Delete</span></i>'
    //                         })

    //                         privateDocRefFullYear.update({
    //                             allReservations: firebase.firestore.FieldValue.arrayUnion({
    //                                 name: form.name.value,
    //                                 phone: form.phone.value,
    //                                 email: form.email.value,
    //                                 people: form.people.value,
    //                                 money: prices[i],
    //                                 teamname: form.teamname.value,
    //                                 language: form.language.value,
    //                                 discount: form.discount.value,
    //                                 gamemode: form.gamemode.value,
    //                                 booking: takenDate,
    //                             })
    //                         })
                            

    //                         if(document.querySelector("#form-messages").textContent == "success") {
    //                             document.querySelector(".heading").style.display = "none";
    //                             form.innerHTML = `
    //                             <div class='heading'>ОК, ${form.name.value}, разбрахме те...</div>
    //                             Играе ти се нещо страшно... Ще го получиш. Часът ти е запазен.<br><br>
    //                             Време е да споделиш на отбора ти за правилата на SawRoom 3, написани на тази страница.<br>
    //                             Същите правила в сбит вариант ги имаш и на имейла ти, също така там са лесни за споделяне с останалите.<br><br>
    //                             Остава да ти пожелаем успех с предстоящото събитие... слагайте железните гащи и до скоро...<br>
    //                             `;
    //                         } else {
    //                             document.querySelector(".heading").style.display = "none";
    //                             form.innerHTML = `
    //                             <div class='heading'>Нещо се обърка :(</div>
    //                             Не можахме да ти пратим имейл, сигурен ли си, че си въвел правилен имейл адрес? Опитай отново и ако грешката е някъде в нас, ни пиши или ни се обади, за да я оправим!
    //                             `;
    //                         }
    //                     }
    //                 }).catch(function(error) {
    //                     console.log("Error getting document:", error);
    //                 });
    //             })
    //         }
    //     })
    // })

    function loadData(doc) {
        for (let i = 0; i < allHours.length; i++) {
            if (allHours[i].getAttribute("data-id")*1000 == doc.data().booking) {
                allHours[i].classList.add("booked");
            }
            if (allHours[i].classList.contains("passed")) {
                allHours[i].classList.remove("booked");
            }
            if(weekendHourSaturdayDiv.getAttribute("data-id")*1000 == doc.data().booking) {
                weekendHourSaturdayDiv.classList.add("booked");
            }
            if (weekendHourSaturdayDiv.classList.contains("passed")) {
                weekendHourSaturdayDiv.classList.remove("booked");
            }
            if(weekendHourSundayDiv.getAttribute("data-id")*1000 == doc.data().booking) {
                weekendHourSundayDiv.classList.add("booked");
            }
            if (weekendHourSundayDiv.classList.contains("passed")) {
                weekendHourSundayDiv.classList.remove("booked");
            }
        }
    }

    let todaysDateStart = todaysDate.getTime();

    if (todaysDateStart >= new Date(st).getTime()){
        document.querySelector(".prevWeek").style.visibility = "visible";
    }

    // Firebase
    sawroomDB.collection("reservationsSecure").where('booking', '>=', todaysDateStart).where('booking', '<=', todaysDateStart + newWeekHours).get().then(function(querySnapshot){
        querySnapshot.forEach(doc => {
            loadData(doc);
        });
    }).catch(err => {
        console.log('Error getting documents', err);
    })
    bookingManipulations();

    element(".nextWeek").addEventListener("click", function() {
        todaysDateStart = todaysDateStart + newWeekHours;
        if (todaysDateStart >= new Date(st).getTime()){
            document.querySelector(".prevWeek").style.visibility = "visible";
        }
        sawroomDB.collection("reservationsSecure").where('booking', '>=', todaysDateStart).where('booking', '<=', todaysDateStart + newWeekHours).get().then(function(querySnapshot){
            querySnapshot.forEach(doc => {
                loadData(doc);
            });
        }).catch(err => {
            console.log('Error getting documents', err);
        })
        bookingManipulations();
    });

    element(".prevWeek").addEventListener("click", function() {
        todaysDateStart = todaysDateStart - newWeekHours;
        if (todaysDateStart < new Date(st).getTime()) {
            document.querySelector(".prevWeek").style.visibility = "hidden";
        } 
        sawroomDB.collection("reservationsSecure").where('booking', '>=', todaysDateStart).where('booking', '<=', todaysDateStart + newWeekHours).get().then(function(querySnapshot){
            querySnapshot.forEach(doc => {
                loadData(doc);
            });
        }).catch(err => {
            console.log('Error getting documents', err);
        })
        bookingManipulations();
    });

    const enableBlocking = document.querySelector(".enableBlocking");
    const deleteBlocking = document.querySelector(".deleteBlocking");

    enableBlocking.addEventListener("click", () => {
        enableBlocking.textContent = "Enable Blocking";
        enableBlocking.classList.toggle("editing");
        if(enableBlocking.classList.contains("editing")) {
            enableBlocking.textContent = "Disable Blocking";
            if(deleteBlocking.classList.contains("editing")){
                deleteBlocking.classList.remove("editing");
                deleteBlocking.textContent = "Delete Blocking"
            }
            document.querySelectorAll("div.free").forEach(booking => {
                booking.addEventListener("click", () => {
                    booking.classList.add("fake");
                    const currentBooking = sawroomDB.collection("reservationsSecure").doc((booking.getAttribute("data-id")*1000).toString());
                    const currentBookingMain = sawroomDB.collection("reservations").doc((booking.getAttribute("data-id")*1000).toString());
                    
                    currentBookingMain.get().then(function(doc) {
                        if(doc.exists) {console.log("Reservation exists!")}
                        else {
                            currentBookingMain.set({
                                booking: booking.getAttribute("data-id")*1000
                            })
                            currentBooking.set({
                                booking: booking.getAttribute("data-id")*1000,
                                name: "Не",
                                fake: true
                            })
                        }
                    })
                })
            })
        }
    })

    deleteBlocking.addEventListener("click", () => {
        deleteBlocking.textContent = "Delete Blocking";
        deleteBlocking.classList.toggle("editing");
        if(deleteBlocking.classList.contains("editing")) {
            if(enableBlocking.classList.contains("editing")){
                enableBlocking.classList.remove("editing");
                enableBlocking.textContent = "Enable Blocking"
            }
            deleteBlocking.textContent = "Deleting Blockings...";
            document.querySelectorAll("div.fake").forEach(fakeBooking => {
                fakeBooking.addEventListener("click", () => {
                    fakeBooking.classList.remove("fake");
                    fakeBooking.classList.remove("booked");

                    const currentBooking = sawroomDB.collection("reservationsSecure").doc((fakeBooking.getAttribute("data-id")*1000).toString());
                    const currentBookingMain = sawroomDB.collection("reservations").doc((fakeBooking.getAttribute("data-id")*1000).toString());
                    
                    currentBookingMain.get().then(function(doc) {
                        if(doc.exists) {
                            currentBookingMain.delete();
                            currentBooking.delete();
                        }
                    })
                })
            })
        }
    })
    
    function bookingManipulations() {
        document.querySelectorAll("div.hour").forEach(booking => {
            // Check if there are fake bookings
            const currentBooking = sawroomDB.collection("reservationsSecure").doc((booking.getAttribute("data-id")*1000).toString());
            currentBooking.get().then(function(doc) {
                if(!booking.classList.contains("booked")) {
                    booking.classList.add("free");
                }
                if(doc.exists) {
                    if(doc.data().fake == true) {
                        booking.classList.add("fake");
                    }
                }
                if(booking.classList.contains("fake")) {
                    booking.classList.remove("booked");
                }
            })

            booking.addEventListener("click", () => {
                const currentBooking = sawroomDB.collection("reservationsSecure").doc((booking.getAttribute("data-id")*1000).toString());
                const currentBookingMain = sawroomDB.collection("reservations").doc((booking.getAttribute("data-id")*1000).toString());
                const privateDocRefFullYear = sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString());

                currentBooking.get().then(function(doc) {
                    
                    if(doc.exists && booking.classList.contains("booked")) {
                        document.querySelector(".confirmDialog").style.display = "flex";
                        document.querySelector(".confirmDialog").innerHTML = `
                        <div class="container" style="max-height: 100%;">
                            <div class="heading">Edit A Reservation</div>
                            <form id="editReservation">
                                <input type="date" class="editInputDate" value="${new Date(doc.data().booking).toLocaleDateString('en-CA')}">
                                <input type="time" class="editInputTime" value="${new Date(doc.data().booking).getUTCHours()}:${new Date(doc.data().booking).getFullMinutes()}">
                                <input required type="text" name="name" placeholder="Name" value="${doc.data().name}">
                                <input required type="number" name="people" placeholder="Players" value="${doc.data().people}">
                                <input required type="number" name="money" placeholder="Money" value="${doc.data().money}">
                                <input required type="phone" name="phone" placeholder="Phone" value="${doc.data().phone}">
                                <input required type="email" name="email" placeholder="Email" value="${doc.data().email}">
                                <input type="text" name="teamname" placeholder="Team Name" value="${doc.data().teamname}">
                                <input type="text" name="language" placeholder="Language" value="${doc.data().language}">
                                <input type="text" name="gamemode" placeholder="Game Mode" value="${doc.data().gamemode}">
                                <input value="${doc.data().discount}" type="text" name="discount" placeholder="Discount">
                            </form>
                            <div style="margin-top: 20px;" class="accept">Edit</div>
                            <div style="margin-top: 20px;" class="decline">Close</div>
                        </div>
                        `
                        const form = document.querySelector("form#editReservation");
                        document.querySelector(".accept").addEventListener("click", () => {
                            currentBooking.delete();
                            currentBookingMain.delete();
                            privateDocRefFullYear.update({
                                allReservations: firebase.firestore.FieldValue.arrayRemove({
                                    name: doc.data().name,
                                    phone: doc.data().phone,
                                    email: doc.data().email,
                                    people: doc.data().people,
                                    money: doc.data().money,
                                    teamname: doc.data().teamname,
                                    language: doc.data().language,
                                    discount: doc.data().discount,
                                    gamemode: doc.data().gamemode,
                                    booking: doc.data().booking
                                })
                            })

                            sawroomDB.collection("reservations").doc((new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000).toString()).set({
                                booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000
                            })

                            sawroomDB.collection("reservationsSecure").doc((new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000).toString()).set({
                                booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000,
                                name: form.name.value,
                                phone: form.phone.value,
                                email: form.email.value,
                                people: form.people.value,
                                money: form.money.value,
                                teamname: form.teamname.value,
                                gamemode: form.gamemode.value,
                                discount: form.discount.value,
                                language: form.language.value,
                                status: doc.data().status,
                                madeOn: doc.data().madeOn,
                                firstOperator: doc.data().firstOperator,
                                secondOperator: doc.data().secondOperator,
                                timeInRoom: "00:00:00",
                                fake: false,
                                operatorReload: `<i class="operatorReload fas fa-redo"></i>`,
                                buttons: '<i id="editBooking" class="fas fa-pen"><span>Edit</span></i><i id="deleteBooking" class="fas fa-minus-square"><span>Delete</span></i>'
                            })
                            privateDocRefFullYear.update({
                                allReservations: firebase.firestore.FieldValue.arrayUnion({
                                    name: form.name.value,
                                    phone: form.phone.value,
                                    email: form.email.value,
                                    people: form.people.value,
                                    money: form.money.value,
                                    teamname: form.teamname.value,
                                    language: form.language.value,
                                    discount: form.discount.value,
                                    gamemode: form.gamemode.value,
                                    booking: new Date(document.querySelector(".editInputDate").value + " " + document.querySelector(".editInputTime").value).getTime() + 10800000
                                })
                            })
                        })
                        document.querySelector(".decline").addEventListener("click", () => {
                            form.reset();
                            document.querySelector(".confirmDialog").style.display = "none";
                        })
                    } else {
                        if(enableBlocking.textContent == "Enable Blocking" && booking.classList.contains("free")) {
                            document.querySelector(".confirmDialog").style.display = "flex";
                            document.querySelector(".confirmDialog").innerHTML = `
                            <div class="container" style="max-height: 100%;">
                                <div class="heading">Add A Reservation</div>
                                <form id="addReservation">
                                    <input required type="text" name="name" placeholder="Name">
                                    <select id="people" name="people" required="" oninvalid="setCustomValidity('Моля изберете брой играчи')" onchange="try{setCustomValidity('')}catch(e){}">
                                        <option selected disabled value="">Брой играчи</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                    <input required type="phone" name="phone" placeholder="Phone">
                                    <input required type="email" name="email" placeholder="Email">
                                    <input type="text" name="teamname" placeholder="Team Name">
                                    <select id="language" name="language" required="" oninvalid="setCustomValidity('Моля изберете език')" onchange="try{setCustomValidity('')}catch(e){}">
                                        <option value="Български">Български</option>
                                        <option value="Английски">Английски</option>
                                    </select>
                                    <select disabled id="gamemode" name="gamemode" required="" oninvalid="setCustomValidity('Моля изберете език')" onchange="try{setCustomValidity('')}catch(e){}">
                                        <option value="Hardcore">Hardcore</option>
                                        <option value="Are you fucking insane?">Are you fucking insane?</option>
                                    </select>
                                    <input type="text" name="discount" placeholder="Discount">

                                </form>
                                <div style="margin-top: 20px;" class="accept">Add</div>
                                <div style="margin-top: 20px;" class="decline">Close</div>
                            </div>
                            `
                            people.addEventListener('change', function() {
                                if(people.value == 3) {
                                    i = 0;
                                }
                                if(people.value == 4) {
                                    i = 1;
                                }
                                if(people.value == 5) {
                                    i = 2;
                                }
                                if(people.value == 6) {
                                    i = 3;
                                }
                                
                                if(i < 2) {
                                    document.querySelector("#gamemode").removeAttribute("disabled");
                                } else {
                                    document.querySelector("#gamemode").setAttribute("disabled", "");
                                    document.querySelector("#gamemode").value = "Hardcore";
                                }
                            })

                            let now = new Date(st);
                            const form = document.querySelector("form#addReservation");

                            // Prices
                            const prices = [115, 140, 160, 180];

                            document.querySelector(".accept").addEventListener("click", () => {
                                sawroomDB.collection("reservations").doc((booking.getAttribute("data-id")*1000).toString()).set({
                                    booking: booking.getAttribute("data-id")*1000
                                })

                                sawroomDB.collection("reservationsSecure").doc((booking.getAttribute("data-id")*1000).toString()).set({
                                    booking: booking.getAttribute("data-id")*1000,
                                    name: form.name.value,
                                    phone: form.phone.value,
                                    email: form.email.value,
                                    people: form.people.value,
                                    money: prices[i],
                                    teamname: form.teamname.value,
                                    gamemode: form.gamemode.value,
                                    discount: form.discount.value,
                                    language: form.language.value,
                                    fake: false,
                                    status: '<i class="fas fa-minus-circle confirmation"></i>',
                                    madeOn: Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds(),now.getMilliseconds()),
                                    firstOperator: firstOperator,
                                    secondOperator: secondOperator,
                                    timeInRoom: "00:00:00",
                                    operatorReload: `<i class="operatorReload fas fa-redo"></i>`,
                                    buttons: '<i id="editBooking" class="fas fa-pen"><span>Edit</span></i><i id="deleteBooking" class="fas fa-minus-square"><span>Delete</span></i>'
                                })
                                privateDocRefFullYear.update({
                                    allReservations: firebase.firestore.FieldValue.arrayUnion({
                                        name: form.name.value,
                                        phone: form.phone.value,
                                        email: form.email.value,
                                        people: form.people.value,
                                        money: prices[i],
                                        teamname: form.teamname.value,
                                        language: form.language.value,
                                        discount: form.discount.value,
                                        gamemode: form.gamemode.value,
                                        booking: booking.getAttribute("data-id")*1000
                                    })
                                })
                                form.reset();
                                document.querySelector(".confirmDialog").innerHTML = "Reservation complete<br><br>Refreshing page...";
                                setTimeout(() => {
                                    document.location.reload();
                                }, 1500);
                            })
                            document.querySelector(".decline").addEventListener("click", () => {
                                form.reset();
                                document.querySelector(".confirmDialog").style.display = "none";
                            })
                        }
                    }
                })
            })
        })
    }
}