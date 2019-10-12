var budgetController = (function() {
    var Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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
            console.log(data)
            return newItem
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
        inputBtn: '.add__btn'
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, // 'inc' ou 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function(){
            return DOMStrings
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
    }
    
    var ctrlAddItem = function(){
        var input 
        var newItem
            // récupérer les données des inputs
            input = UIC.getInput()
            
            // ajouter la nouvelle entrée sur le contrôleur budget
            newItem = budgetC.addItem(input.type, input.description, input.value)
    }

    return {
        init: function(){
            setupEventListeners()
        }
    }
        
})(budgetController, UIController)

controller.init()