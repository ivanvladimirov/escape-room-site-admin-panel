const loginForm = element("#loginForm");
const modal = element(".modal");

function convertMiliseconds(miliseconds) {
    var days, total_hours, total_minutes, total_seconds;
    
    total_seconds = parseInt(Math.floor(miliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));

    return days;
}

auth.onAuthStateChanged(user => {
    if (user) {
        body.append(headerBar);
        headerBar.append(logo);
        headerBar.append(heading);
        headerBar.append(buttons);
        buttons.append(allGroups);
        buttons.append(dashboard);
        buttons.append(monthlyTables);
        buttons.append(calendar);
        buttons.append(vouchers);
        headerBar.append(settings);
        settings.append(logout);

        document.querySelector(".logo").addEventListener("click", function() {
            document.querySelector(".confirmDialog").style.display = "flex";
            document.querySelector(".confirmDialog").innerHTML = `
            <div class="container">
                <div class="heading">Pick a room</div>
                <a href="./saw2.html">SawRoom: The Revenge</a><br>
                <a href="./saw3.html">SawRoom: Game Over</a><br>
                <div style="margin-top: 20px;" class="decline">Close</div>
            </div>
            `
            document.querySelector(".decline").addEventListener("click", function() {
                document.querySelector(".confirmDialog").style.display = "none";
            })
        })
        
        if (element(".allGroups").classList.contains("selected")) {
            sawroomDB.collection("reservationsSecure").where("fake", "==", false).where("booking", ">=", (todaysDate.getTime())).where("booking", "<", (todaysDate.getTime() + 183600000)).orderBy("booking", "asc").get().then(snapshot => {
                loadDataAllGroups(snapshot.docs);
            })
            
            // All Unfinished Tasks Table
            let allUnfinishedTasks = '';
            sawroomDB.collection("tasks").orderBy("dateAdded", "desc").where("isFinished", "==", false)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    const task = doc.data();
                    let daysLeft = task.finishBefore - task.dateAdded;

                    const tr = `
                        <tr id="${doc.id}" class="task">
                            <td><div class="controls"><i id="finishTask" title="Mark As Finished" class="fas fa-check"></i> | <i id="deleteTask" title="Delete Task" class="fas fa-trash-alt"></i> | </div><strong style="text-transform: capitalize;">${task.name}</strong> - <span style="text-overflow: ellipsis;padding-right: 30px; height: 40px;">${task.content}</span> <span id="urgency" title="Date Added: ${new Intl.DateTimeFormat('en-GB').format(new Date(task.dateAdded))}" class="isUrgent${task.isUrgent}"></span></td>
                        </tr>
                        <tr class="taskDate">
                            <td><span style="color: rgba(255,255,255,0.5)" title="Finish Before">Finish Before: ${new Intl.DateTimeFormat('en-GB').format(new Date(task.finishBefore))} (${convertMiliseconds(daysLeft)} Days Left)</span></td>
                        </tr>
                    `

                    if(convertMiliseconds(daysLeft) < 2) {
                        sawroomDB.collection("tasks").doc(doc.id).update({
                            isUrgent: true
                        })
                    } else {
                        sawroomDB.collection("tasks").doc(doc.id).update({
                            isUrgent: false
                        })
                    }

                    allUnfinishedTasks += tr;
                });
                const noTasks = create("div");
                noTasks.innerHTML = `<div style="text-align: center;"><i class="far fa-folder-open"></i> No tasks found</div>`;
                noTasks.className = "hidden";
                noTasks.setAttribute("style", "margin-top: 10px;")

                if (allUnfinishedTasks == "") {
                    noTasks.setAttribute("class", "noTasks");
                }
                
            // Generate HTML Table
            tasksTable.classList = "tasksTable unfinishedTasksTable"
            tasksTable.innerHTML = allUnfinishedTasks;
            unfinishedTasks.append(unfinishedTasksHeading);
            unfinishedTasks.append(addTask);
            unfinishedTasks.append(noTasks);
            unfinishedTasks.append(tasksTable.cloneNode(true));

            // Adding a Task
            document.querySelector(".addTask").addEventListener("click", function() {
                document.querySelector(".confirmDialog").style.display = "flex";
                document.querySelector(".confirmDialog").innerHTML = `
                <div class="container" style="max-height: 100%;">
                    <div class="heading">Add A Task</div>
                    <form id="addTask">
                        <input required type="text" name="name" placeholder="Task Name">
                        <textarea name="content" placeholder="Task Content"></textarea>
                        <div class="labels">
                            <label>Finish Before:</label>
                            <input required name="date" type="date" value="">
                        </div>
                        <div class="labels">
                            <label>Is it urgent?</label>
                            <div><input name="radio" type="radio" id="yes" value="true" name="selector"><label for="yes">Yes</label></div>
                            <div><input checked name="radio" type="radio" id="no" value="false" name="selector"><label for="no">No</label></div>
                        </div>
                    </form>
                    <div style="margin-top: 20px;" class="accept">Add</div>
                    <div style="margin-top: 20px;" class="decline">Close</div>
                </div>
                `

                const form = document.querySelector("#addTask");
                console.log(form.date.value)
                document.querySelector(".accept").addEventListener("click", function() {
                    if(form.name.value !== "" && form.content.value !== "" && form.date.value !== "") {
                        sawroomDB.collection("tasks").add({
                            name: form.name.value,
                            content: form.content.value,
                            dateAdded: new Date().getTime(),
                            finishBefore: new Date(form.date.value).getTime(),
                            isUrgent: form.radio.value,
                            isFinished: false,
                            dateFinished: ""
                        })
                        setTimeout(() => {
                            document.location.reload();
                        }, 500);
                    } else {
                        console.log("Fill all fields")
                    }
                })

                document.querySelector(".decline").addEventListener("click", function() {
                    document.querySelector(".confirmDialog").style.display = "none";
                })
            })

            // Finish Task & Delete Task Buttons
            const finishTask = document.querySelectorAll("#finishTask");
            const deleteTask =  document.querySelectorAll("#deleteTask");

            finishTask.forEach(element => {
                element.addEventListener("click", function() {
                    sawroomDB.collection("tasks").doc(element.parentElement.parentElement.parentElement.getAttribute("id")).update({
                        isFinished: true,
                        dateFinished: new Date().getTime()
                    })
                    setTimeout(() => {
                        document.location.reload();
                    }, 500);
                })
            })

            deleteTask.forEach(element => {
                element.addEventListener("click", function() {
                    sawroomDB.collection("tasks").doc(element.parentElement.parentElement.parentElement.getAttribute("id")).delete().then(function() {
                        element.parentElement.parentElement.parentElement.style.display = "none";
                        element.parentElement.parentElement.parentElement.nextElementSibling.style.display = "none";
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                })
            })

            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            // All Finished Tasks Table
            let allFinishedTasks = '';
            sawroomDB.collection("tasks").orderBy("dateFinished", "desc").where("isFinished", "==", true).where("dateFinished", ">=", new Date().getTime()-604800000)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    const task = doc.data();
                    const tr = `
                        <tr class="task">
                            <td><strong style="text-transform: capitalize;">${task.name}</strong> - <span style="padding-right: 30px">${task.content}</span> <span title="Finish Before: ${new Intl.DateTimeFormat('en-GB').format(new Date(task.finishBefore))}" class="isUrgent${task.isUrgent}"></span></td>
                        </tr>
                        <tr class="taskDate">
                            <td>Finished: <span style="color: rgba(255,255,255,0.5)" title="Date Finished">${new Intl.DateTimeFormat('en-GB').format(new Date(task.dateFinished))}</span></td>
                        </tr>
                    `
                    allFinishedTasks += tr;
            });

            // Generate Table
            tasksTable.classList = "tasksTable finishedTasksTable"
            tasksTable.innerHTML = allFinishedTasks;
            finishedTasks.append(finishedTasksHeading);
            finishedTasks.append(tasksTable.cloneNode(true));

            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }

        // Vouchers Page
        
        // document.querySelector(".vouchers").addEventListener("click", function() {
        //     element(".dashboard").classList.remove("selected");
        //     document.querySelector(".headerBar").children[1].textContent = "SawRoom Vouchers";
        //     element(".tables").classList.remove("selected");
        //     element(".vouchers").classList.add("selected");
        //     sawroomDB.collection("reservationsSecure").orderBy("booking", "desc").get().then(snapshot => {
        //         loadDataVouchers(snapshot.docs);
        //     })

        //     // Remove Dashboard Content
        //     loadDataDashboard([]);
        //     body.removeChild(dashboardDiv);
        //     table.removeChild(tableHeadDashboard);
        //     content.removeChild(input);

        //     // Remove Tables Content

        //     // FIIIIIIIIIIIIIIIIIIIIIIIX
        //     loadDataMonthlyTables([]);
        //     content.removeChild(monthlyTablesDiv);
        // })

        document.querySelector(".calendar").addEventListener("click", function() {
            document.querySelector(".headerBar").children[1].textContent = "SawRoom Calendar";
            element(".dashboard").classList.remove("selected");
            element(".tables").classList.remove("selected");
            element(".allGroups").classList.remove("selected");
            element(".vouchers").classList.remove("selected");
            element(".calendar").classList.add("selected");
            sawroomDB.collection("reservationsSecure").orderBy("booking", "desc").get().then(snapshot => {
                loadDataCalendar(snapshot.docs);
            })

            // Remove All Groups Content
            loadDataAllGroups([]);
            body.removeChild(allGroupsDiv);
            table.removeChild(tableHeadAllGroups);

            // Remove Dashboard Content
            loadDataDashboard([]);
            body.removeChild(dashboardDiv);
            table.removeChild(tableHeadDashboard);

            // Remove Vouchers Content
            loadDataVouchers([]);

            // Remove Tables Content
            loadDataMonthlyTables([]);
            table.removeChild(tableHeadMonthlyTables);
            body.removeChild(monthlyTablesDiv);
        })

        document.querySelector(".allGroups").addEventListener("click", function() {
            document.querySelector(".headerBar").children[1].textContent = "SawRoom Dashboard";
            element(".allGroups").classList.add("selected");
            element(".dashboard").classList.remove("selected");
            element(".tables").classList.remove("selected");
            element(".vouchers").classList.remove("selected");
            element(".calendar").classList.remove("selected");

            
            sawroomDB.collection("reservationsSecure").where("fake", "==", false).where("booking", ">=", (todaysDate.getTime())).where("booking", "<", (todaysDate.getTime() + 183600000)).orderBy("booking", "asc").get().then(snapshot => {
                loadDataAllGroups(snapshot.docs);
            })

            // Remove Calendar Content
            loadDataCalendar([]);
            body.removeChild(calendarDiv);

            // Remove Dashboard Content
            loadDataDashboard([]);
            body.removeChild(dashboardDiv);
            table.removeChild(tableHeadDashboard);

            // Remove Vouchers Content
            loadDataVouchers([]);

            // Remove Tables Content
            loadDataMonthlyTables([]);
            table.removeChild(tableHeadMonthlyTables)
            body.removeChild(monthlyTablesDiv);

            // FIIIIIIIIIIIIIIIIIIIIIIIX
        })

        document.querySelector(".dashboard").addEventListener("click", function() {
            document.querySelector(".headerBar").children[1].textContent = "SawRoom All Groups";
            element(".dashboard").classList.add("selected");
            element(".allGroups").classList.remove("selected");
            element(".tables").classList.remove("selected");
            element(".vouchers").classList.remove("selected");
            element(".calendar").classList.remove("selected");
            
            sawroomDB.collection("reservationsSecure").where("fake", "==", false).where("booking", ">=", (todaysDate.getTime()-604800000)).orderBy("booking", "desc").get().then(snapshot => {
                loadDataDashboard(snapshot.docs);
            })

            // Remove Calendar Content
            loadDataCalendar([]);
            body.removeChild(calendarDiv);

            // Remove All Groups Content
            loadDataAllGroups([]);
            body.removeChild(allGroupsDiv);
            table.removeChild(tableHeadAllGroups);

            // Remove Vouchers Content
            loadDataVouchers([]);

            // Remove Tables Content
            loadDataMonthlyTables([]);
            table.removeChild(tableHeadMonthlyTables)
            body.removeChild(monthlyTablesDiv);

            // FIIIIIIIIIIIIIIIIIIIIIIIX
        })

        element(".tables").addEventListener("click", function() {
            element(".headerBar").children[1].textContent = "SawRoom Monthly Tables";
            element(".allGroups").classList.remove("selected");
            element(".dashboard").classList.remove("selected");
            element(".tables").classList.add("selected");
            element(".vouchers").classList.remove("selected");
            element(".calendar").classList.remove("selected");

            let allOptions = '';
            
            todaysMonthTextCurrentMonth.addEventListener("click", function() {
                todaysMonthTextAllMonths.style.display = "initial";
                if (allOptions == '') {
                    sawroomDB.collection("months").orderBy("startDate", "desc")
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        const option = `<div id="${doc.id}" class="month">${doc.data().name}</div>`;
                        allOptions += option;
                        // ТHATS FUCKING GOOD TO KNOW! console.log(querySnapshot.size)
                    });
                    todaysMonthTextAllMonths.innerHTML = allOptions;
            
                    document.querySelectorAll(".month").forEach(element => {
                        element.addEventListener("click", function() {
                            sawroomDB.collection("months").doc(element.getAttribute("id")).get().then(doc => {
                                sawroomDB.collection("reservationsSecure").where('booking', '>=', doc.data().startDate).where('booking', '<=', doc.data().endDate).orderBy("booking", "desc").get().then(snapshot => {
                                    todaysMonthTextCurrentMonth.textContent = doc.data().name;
                                    expensesItems.innerHTML = doc.data().expenses;
                                    startDate.setAttribute("value", `${new Date(doc.data().startDate).toLocaleDateString('en-CA')}`)
                                    endDate.setAttribute("value", `${new Date(doc.data().endDate).toLocaleDateString('en-CA')}`)
                                    loadDataMonthlyTables(snapshot.docs);
                                    sawroomDB.collection("months").doc(element.getAttribute("id")).update({
                                            "groups": document.querySelectorAll(".reservations").length
                                    }).then(function() {
                                        console.log("Groups successfully updated!");
                                    });
                                    
                                    sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                        {allMonths: firebase.firestore.FieldValue.arrayUnion({
                                            month: doc.data().name, 
                                            groups: document.querySelectorAll(".reservations").length
                                        })}
                                    )
                                    for (let i = 1; i < 10; i++) {
                                        sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                            {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                                month: doc.data().name, 
                                                groups: document.querySelectorAll(".reservations").length - i
                                            })}
                                        )
                                        sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                            {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                                month: doc.data().name, 
                                                groups: document.querySelectorAll(".reservations").length + i
                                            })}
                                        )
                                    }
                                })

                            })

                            todaysMonthTextAllMonths.style.display = "none";
                        })
                    })
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
                }
                
            })

            const docData = {
                startDate: new Date().setUTCHours(0,0,0,0),
                endDate: new Date().getTime() + 2592000000,
                name: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()),
                expenses: []
            }

            var d = new Date();
            var newMonth = d.getMonth() - 1;
            if (newMonth < 0){
                newMonth += 12;
                d.setYear(d.getYear() - 1);
            }
            d.setMonth(newMonth);
            const month = ['january','february','march','april','may','june','july','august','september','october','november','december']

            // Check the end date of the previous month
            if(month[newMonth] == "december") {
                var docMonthCheck = sawroomDB.collection("months").doc(month[newMonth] + (new Date().getFullYear() - 1));
            } else {
                var docMonthCheck = sawroomDB.collection("months").doc(month[newMonth] + new Date().getFullYear());
            }
            docMonthCheck.get().then(function(doc) {
                // if the end date has not passed yet, show all the confirmed bookings for the current month
                if (doc.data().endDate > new Date().getTime()) {
                    sawroomDB.collection("reservationsSecure").where('booking', '>=', doc.data().startDate).where('booking', '<=', doc.data().endDate).orderBy("booking", "desc").get().then(snapshot => {
                        todaysMonthTextCurrentMonth.textContent = doc.data().name;
                        expensesItems.innerHTML = doc.data().expenses;
                        
                        startDate.setAttribute("value", `${new Date(doc.data().startDate).toLocaleDateString('en-CA')}`)
                        endDate.setAttribute("value", `${new Date(doc.data().endDate).toLocaleDateString('en-CA')}`)

                        loadDataMonthlyTables(snapshot.docs);
                        
                        if(month[newMonth] == "december") {
                            sawroomDB.collection("months").doc(month[newMonth] + (new Date().getFullYear() - 1)).update({
                                "groups": document.querySelectorAll(".reservations").length
                            })
                        } else {
                            sawroomDB.collection("months").doc(month[newMonth] + new Date().getFullYear()).update({
                                "groups": document.querySelectorAll(".reservations").length
                            })
                        }
                        
                    })
                    // if else, go to the next month and create it if it has not been created yet
                } else {
                    const docMonth = sawroomDB.collection("months").doc(new Intl.DateTimeFormat('en-GB', {month: "long"}).format(new Date()).toLowerCase() + new Date().getFullYear());
                    docMonth.get().then(function(doc) {
                        // This month
                        if(doc.exists) {
                            sawroomDB.collection("reservationsSecure").where('booking', '>=', doc.data().startDate).where('booking', '<=', doc.data().endDate).orderBy("booking", "desc").get().then(snapshot => {
                                todaysMonthTextCurrentMonth.textContent = doc.data().name;
                                expensesItems.innerHTML = doc.data().expenses;
                                
                                startDate.setAttribute("value", `${new Date(doc.data().startDate).toLocaleDateString('en-CA')}`)
                                endDate.setAttribute("value", `${new Date(doc.data().endDate).toLocaleDateString('en-CA')}`)

                                loadDataMonthlyTables(snapshot.docs);
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayUnion({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length
                                    })}
                                )
                                for (let i = 1; i < 10; i++) {
                                    sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                        {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                            month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                            groups: document.querySelectorAll(".reservations").length - i
                                        })}
                                    )
                                    sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                        {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                            month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                            groups: document.querySelectorAll(".reservations").length + i
                                        })}
                                    )
                                }
                            })
                        }
                        else {
                            sawroomDB.collection("months").doc(new Intl.DateTimeFormat('en-GB', {month: "long"}).format(new Date()).toLowerCase() + new Date().getFullYear()).set(docData).then(function() {
                                console.log("Document successfully written");
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayUnion({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length
                                    })}
                                )
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length - 1
                                    })}
                                )
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length - 2
                                    })}
                                )
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length - 3
                                    })}
                                )
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length - 4
                                    })}
                                )
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length + 1
                                    })}
                                )
                                sawroomDB.collection("reservationsSecure").doc(new Date().getFullYear().toString()).update(
                                    {allMonths: firebase.firestore.FieldValue.arrayRemove({
                                        month: new Intl.DateTimeFormat('en-GB', {month: "long", year: "numeric"}).format(new Date()), 
                                        groups: document.querySelectorAll(".reservations").length + 2
                                    })}
                                )
                            });
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

            // Remove Calendar Content
            loadDataCalendar([]);
            body.removeChild(calendarDiv);

            // Remove All Groups Content
            loadDataAllGroups([]);
            body.removeChild(allGroupsDiv);
            table.removeChild(tableHeadAllGroups);

            // Remove Dashboard Content
            loadDataDashboard([]);
            body.removeChild(dashboardDiv);
            dashboardDiv.removeChild(input)
            table.removeChild(tableHeadDashboard);

            // Remove Vouchers Content
            loadDataVouchers([]);
        })

        modal.style.display = "none";
    }
        else {
            console.log("no user");
            loadDataDashboard([]);
            loadDataMonthlyTables([]);
            loadDataVouchers([]);
            content.removeChild(monthlyTablesDiv);
            body.removeChild(content)
            modal.style.display = "flex";
        }
})

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get user info
    const email = loginForm['loginEmail'].value;
    const password = loginForm['loginPassword'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        loginForm.reset();
    })
})

logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('user signed out');
    })
})