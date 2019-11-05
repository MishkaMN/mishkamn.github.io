var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        mergeBtn: '#merge__btn',
        sortBtn: '#sort__btn',
        incomeList: '#income__list',
        expensesList: '#expenses__list',
        separateContainer: '.separate__panel',
        combinedContainer: '.combined__panel',
        combinedList: '#combined__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        dateTimeField: '.tail-datetime-field',
        dateTimeCalendar: '.calendar-actions',
        itemValue: '.item__value',
        deleteBtn: '.delete__btn',
        item:'.item',
        income:'.income',
        expenses:'.expenses'
    };
    
    
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var formatDate = function(date) {
        try{
            var formattedDate;
            date = date.split(" ")
            date = date.slice(0,2).concat(date[2].split(":"))
            date.forEach(function(element, index){
                date[index] = parseInt(element)
            });
            formattedDate = new Date(2019, date[0], date[1] - 1, date[2], date[3])
            return formattedDate
        }
        catch{
            return undefined
        }
    };

    
    
    var nodeListForEach = function(list, callback) {
        var returnValue;
        for (var i = 0; i < list.length; i++) {
            returnValue = callback(list[i], i);
            if (returnValue)
                return returnValue
        }
    };
    
    
    return {
        changeListView: function(){
            // change button text
            if (document.querySelector(DOMstrings.mergeBtn).innerText ==='Merge Transactions'){
                document.querySelector(DOMstrings.mergeBtn).innerText = 'Separate Transactions';
            }
            else{
                document.querySelector(DOMstrings.mergeBtn).innerText = 'Merge Transactions';
            }
            // change view
            document.querySelector(DOMstrings.combinedContainer).classList.toggle('hide__this__panel');
            document.querySelector(DOMstrings.separateContainer).classList.toggle('hide__this__panel');
        },
        getInput: function() {
            var fromInput = (function() {
                var value, rawValue, type;
                rawValue = document.querySelector(DOMstrings.inputValue).value;
                rawDate = document.querySelector(DOMstrings.dateTimeField).value;
                
                // Process the signs in rawValue if there is one
                if (rawValue && rawValue[0] == '+'){
                    type = 'inc'
                    value = parseFloat(rawValue.substr(1,rawValue.length));
                }
                else if(rawValue && rawValue[0] == '-'){
                    type = 'exp'
                    value = parseFloat(rawValue.substr(1,rawValue.length));
                }
                else {
                    value = parseFloat(rawValue);
                }

                // Get Date
                date = formatDate(rawDate)

                return {value, type, date}
            })();
            
            return {
                // if type is not already set, query it from UI
                type: fromInput.type ? fromInput.type : document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: fromInput.value,
                date: fromInput.date
            };
        },
        
        
        addListItem: function(obj, type) {
            var html = [], newHtml = [], element = [];
            // Create HTML string with placeholder text
            // 0 for seprate, 1 for combined panel
            if (type === 'inc') {
                element = element.concat(DOMstrings.incomeList);
                
                html = html.concat('<li class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__time">%time%</div><div class="item__date">%date%</div><div class="item__value">%value%</div><div class="item__delete"><button class="delete__btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></li>');
                html = html.concat('<li class="income" id="inc-%id%"><div class="item clearfix"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__time">%time%</div><div class="item__date">%date%</div><div class="item__value">%value%</div><div class="item__delete"><button class="delete__btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div></li>')
            } else if (type === 'exp') {
                element = element.concat(DOMstrings.expensesList);
                
                html = html.concat('<li class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__time">%time%</div><div class="item__date">%date%</div><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="delete__btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></li>');
                html = html.concat('<li class="expenses" id="exp-%id%"><div class="item clearfix"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__time">%time%</div><div class="item__date">%date%</div><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="delete__btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div></li>');
            }
            // Combined listing's element
            element = element.concat(DOMstrings.combinedList);
            
            // Replace the placeholder text with some actual data
            html.forEach(function(el, index){
                newHtml = newHtml.concat(el.replace('%id%', obj.id));
                newHtml[index] = newHtml[index].replace('%description%', obj.description);
                newHtml[index] = newHtml[index].replace('%value%', formatNumber(obj.value, type));
                newHtml[index] = newHtml[index].replace('%time%', obj.date.toLocaleTimeString())
                newHtml[index] = newHtml[index].replace('%date%', obj.date.toDateString().substr(0,obj.date.toDateString().length -5))
            });
                       
            // Insert the HTML into the DOM
            // FIXME show different position depending on pos in array
            document.querySelector(element[0]).insertAdjacentHTML('beforeend', newHtml[0]);
            document.querySelector(element[1]).insertAdjacentHTML('beforeend', newHtml[1]);
        },
        
        
        deleteListItem: function(selectorID) {
            var el;
            var el = document.getElementById(selectorID);
            while (el){
                el.parentNode.removeChild(el);
                el = document.getElementById(selectorID);
            }
        },
        
        sortList: function(budget){
            // Change button text for ascending and descending
            var dir;
            if (document.querySelector(DOMstrings.sortBtn).innerText ==='Sort Ascending by Value'){
                document.querySelector(DOMstrings.sortBtn).innerText = 'Sort Descending by Value';
                dir = 'asc';
            }
            else{
                document.querySelector(DOMstrings.sortBtn).innerText = 'Sort Ascending by Value';
                dir = 'desc'
            }

            // Sorting function for specified list
            var sort = function(listName, dir, budget){

                var i, list, switching, transactions, shouldSwitch, curr_trans, next_trans, curr_value, next_value;
                list = document.querySelector(listName);
                switching = true;
                // Make a loop that will continue until no switching has been done:
                while (switching) {

                    // Start by saying: no switching is done:
                    switching = false;
                    transactions = list.querySelectorAll("li");
                    console.log('printing transactions:', transactions);
                    // Loop through all list-items:
                    for (i = 0; i < (transactions.length - 1); i++) {
                        // Start by saying there should be no switching:
                        shouldSwitch = false;
                        curr_trans = transactions[i].id;
                        next_trans = transactions[i + 1].id;
                        transes = [curr_trans, next_trans];
                        
                        // Process HTML id into real usable id
                        transes = transes.map(function(el){
                            el = el.split("-");
                            el[1] = parseInt(el[1]);
                            console.log('processed transId: ', el);
                            return el;
                            
                        });

                        curr_trans = transes[0];
                        next_trans = transes[1];
                        console.log('should be split and shet now', curr_trans, next_trans, transes);
                        
                        // function to extract values out of budget using given trans
                        var getValues = (function(transId, budget){
                            var returnValue;
                            var checkId = function(el){
                                console.log('inside checkID el.id, tranID', el.id, transId);
                                if (transId[1] === el.id){
                                    console.log('checkid returned value: ', el.value);
                                    return el.value;
                                }
                            }
                            console.log('inside getValues, check trans', transId);
                            if (transId[0] === 'inc')
                                returnValue = nodeListForEach(budget.allInc, checkId);
                            else if (transId[0] === 'exp')
                                returnValue = nodeListForEach(budget.allExp, checkId);
                            console.log('getValues returning value: ', returnValue);
                            return returnValue;
                        });

                        curr_value = getValues(curr_trans, budget);
                        next_value = getValues(next_trans, budget);
                        /* Check if the next item should switch place with the current item,
                        based on the sorting direction (asc or desc): */
                        console.log('curr and next values: ', curr_value, next_value);
                        if (dir == "asc") {
                            if (curr_value > next_value) {
                                /* If next item's value is lower than current item,
                                mark as a switch and break the loop: */
                                shouldSwitch = true;
                                break;
                            }
                        } else if (dir == "desc") {
                            if (curr_value < next_value) {
                                /* If next item's value higher than current item,
                                mark as a switch and break the loop: */
                                shouldSwitch= true;
                                break;
                            }
                        }
                        console.log('loop ended');
                    }

                    if (shouldSwitch) {
                        /* If a switch has been marked, make the switch
                        and mark that a switch has been done: */
                        transactions[i].closest(listName).insertBefore(transactions[i + 1], transactions[i]);
                        switching = true;
                    } 
                }
            }

            // Sort all lists
            sort(DOMstrings.incomeList, dir, budget);
            sort(DOMstrings.expensesList,dir, budget);
            sort(DOMstrings.combinedList,dir, budget);
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.dateTimeField + ', ' + DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[1].focus();
        },
        
        
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        
        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue + ',' +
                DOMstrings.dateTimeField);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });

            document.querySelector(DOMstrings.dateTimeCalendar).classList.toggle('red-background');

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();
