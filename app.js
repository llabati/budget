var budgetController = (function() {
    var Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }
    
    var Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) this.percentage = Math.round((this.value / totalIncome) * 100)
        else this.percentage = -1
    }
    Expense.prototype.getPercentage = function(){
        return this.percentage
    }

    var calculateTotal = function(type){
        var sum = 0
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value
        })
        data.totals[type] = sum
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }
            else {
                ID = 0
            }

            if (type === "inc") {
                newItem = new Income(ID, des, val)
            } else if (type === "exp") {
                newItem = new Expense(ID, des, val)
            }
            data.allItems[type].push(newItem)
            return newItem
        },
        deleteItem(type, id){
            var ids, index
            console.log(data.allItems['exp'])
            ids = data.allItems[type].map(function(current) {
                return current.id
            })
            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },
        calculateBudget: function(){
            calculateTotal('inc')
            calculateTotal('exp')

            data.budget = data.totals.inc - data.totals.exp
            if (data.totals.inc > 0) data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc)
            })

        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage()
            })
            return allPerc
        },

        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data)
        }
    }
})()

var UIController = (function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }
    var formatNumber = function(num, type) {
        var numSplit, int, dec, hundreds 
        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')
        int = numSplit[0]
        dec = numSplit[1]
        console.log(numSplit)
        hundreds = int.length - 3
        if (int.length > 3){
            int = int.substr(0, hundreds) + ' ' + int.substr(hundreds, 3)
        }
        return (type === 'exp' ? '-' : '+') + int + ',' + dec

    }
        var nodeListForEach = function(list, callback){
                for(var i = 0; i <list.length; i++){
                    callback(list[i], i)
                }
            }
            
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, // 'inc' ou 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: Number(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        getDOMStrings: function(){
            return DOMStrings
        },
        addListItem: function(obj, type){
            var html, newHtml, element
            
            if (type === 'inc'){
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = DOMStrings.expensesContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'         
            }
            
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))
            newHtml = newHtml.replace('%percentage%', obj.percentage)
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
            
        },
        typeChange: function(){
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue)
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus')
            })
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red')
        },
        
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },
        
        clearFields: function(){
            var fields, fieldsArr
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields)
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = ''
            })
        },
        displayBudget: function(obj){
            var type = obj.budget > 0 ? 'inc' : 'exp'
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp')
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = ''
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesPerLabel)

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) current.textContent = percentages[index] + '%'
                else current.textContent = ''
            })

        },
        displayMonth: function(){
            var months = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ]
            var month = new Date().getMonth()
            document.querySelector(DOMStrings.dateLabel).textContent = months[month]
        }
    }
})()

var controller = (function(budgetC, UIC) {
    var setupEventListeners = function(){
        var DOM = UIC.getDOMStrings()
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        
        document.addEventListener('keypress', function(event){
            if ( event.keyCode === 13 || event.which === 13 ) {
                ctrlAddItem()
            }
        })
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', UIC.typeChange)
    }
    var updateBudget = function(){
        budgetC.calculateBudget()
        var budget = budgetC.getBudget()
        UIC.displayBudget(budget)
    }
    var updatePercentages= function(){
        budgetC.calculatePercentages()
        var percentages = budgetC.getPercentages()
        UIC.displayPercentages(percentages)
    }
    
    var ctrlAddItem = function(){
        var input 
        var newItem
            // récupérer les données des inputs
            input = UIC.getInput()

            if (input.description !== "" && !isNaN(input.value) && input.value !== 0) {
            
            // ajouter la nouvelle entrée sur le contrôleur budget
            newItem = budgetC.addItem(input.type, input.description, input.value)
            console.log(newItem)

            //insérer la nouvelle entrée dans le HTML
            UIC.addListItem(newItem, input.type)

            //effacer les champs dans l'UI
            UIC.clearFields()

            updateBudget()

            updatePercentages()

            }
    }

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID){
            splitID = itemID.split('-')
            type = splitID[0]
            ID = splitID[1]

            budgetC.deleteItem(type, ID)

            UIC.deleteListItem(itemID)

            updateBudget()

            updatePercentages()
        }
    }

    return {
        init: function(){
            setupEventListeners()
            UIC.displayMonth()
            UIC.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })

        }
    }
        
})(budgetController, UIController)

controller.init()