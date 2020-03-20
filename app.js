// Storage Controller
const StorageController = (function () {
    const storeItem = function (item) {
        let items;

        // Check if any items in local storage
        if (localStorage.getItem("items") === null) {
            items = [];
            // Push new item
            items.push(item);
            // Set local storage
            localStorage.setItem("items", JSON.stringify(items));
        } else {
            // Get what is already in local storage 
            items = JSON.parse(localStorage.getItem("items"));
            // Push new item
            items.push(item);

            // Re-set local storage
            localStorage.setItem("items", JSON.stringify(items));
        }
    }

    const getItemsFromStorage = function () {
        let items;
        if (localStorage.getItem("items") === null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem("items"));
        }
        return items;
    }

    const updateItemStorage = function (updatedItem) {
        let items = JSON.parse(localStorage.getItem("items"));

        items.forEach(function (item, index) {
            if (updatedItem.id === item.id) {
                items.splice(index, 1, updatedItem);
            }
        });
        // Re-set local storage
        localStorage.setItem("items", JSON.stringify(items));
    }

    const deleteItemFromStorage = function (id) {
        let items = JSON.parse(localStorage.getItem("items"));

        items.forEach(function (item, index) {
            if (id === item.id) {
                items.splice(index, 1);
            }
        });
        // Re-set local storage
        localStorage.setItem("items", JSON.stringify(items));
    }

    const clearItemsFromStorage = function () {
        localStorage.removeItem("items");
    }
    //Public methods
    return {
        storeItem: storeItem,
        getItemsFromStorage: getItemsFromStorage,
        updateItemStorage: updateItemStorage,
        deleteItemFromStorage: deleteItemFromStorage,
        clearItemsFromStorage: clearItemsFromStorage
    }
})();












// Item Controller
const ItemController = (function () {
    class Item {
        constructor(id, itemName, itemPrice, itemCount) {
            this.id = id
            this.itemName = itemName
            this.itemPrice = itemPrice
            this.itemCount = itemCount
        }
    }

    // State
    const state = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalPrice: 0

    }

    // get items
    const getItems = function () {
        return state.items
    }

    const getItemById = function (id) {
        let found = null;

        state.items.forEach(function (item) {
            if (item.id === id) {
                found = item
            }
        })

        return found
    }
    const addItem = function (name, price, count) {
        let ID = 0;
        const itemsLength = state.items.length
        // Create ID
        if (itemsLength > 1) {
            ID = state.items[itemsLength - 1].id + 1
        } else {
            ID = 0
        }
        // Create new Item
        newItem = new Item(ID, name, price, count)

        // Add to items array
        state.items.push(newItem)

        return newItem
    }

    const updateItem = function (name, price, count) {
        // Price and count to number
        price = parseInt(price)
        count = parseInt(count)

        let found = null
        state.items.forEach(function (item) {
            if (item.id === state.currentItem.id) {
                item.itemName = name
                item.itemPrice = price
                item.itemCount = count
                found = item
            }
        })

        return found
    }

    const deleteItem = function (id) {
        // Get ids 
        ids = state.items.map(function (item) {
            return item.id;
        })

        // Get index
        const index = ids.indexOf(id)

        // Remove item
        state.items.splice(index, 1)
    }

    const deleteAllItems = function () {
        state.items = []
    }
    const setCurrentItem = function (item) {
        state.currentItem = item
    }

    const getCurrentItem = function () {
        return state.currentItem
    }
    const checkUniqueName = function (name) {
        return state.items.find(item => item.itemName === name)
    }

    const getTotalPrice = function () {
        let total = 0
        // Loop through items and add prices
        state.items.forEach(function (item) {
            total += parseInt(item.itemPrice)
        })

        return total
    }

    // Log Data
    const dataLog = function () {
        console.log(state)
    }
    // Public Methods
    return {
        getItems: getItems,
        dataLog: dataLog,
        addItem: addItem,
        getTotalPrice: getTotalPrice,
        uniqueName: checkUniqueName,
        getItemById: getItemById,
        setCurrentItem: setCurrentItem,
        getCurrentItem: getCurrentItem,
        updateItem: updateItem,
        deleteItem: deleteItem,
        deleteAllItems: deleteAllItems
    }
})()












// UI Controller
const UIController = (function () {

    // All UI selector
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearAllBtn: '.clear-all-btn',
        ItemNameInput: '#item-name',
        itemPriceInput: '#item-price',
        itemCountInput: '#item-count',
        totalPrice: '.total-price'
    }

    const populateItems = function (items) {
        let html = ''
        items.forEach(function (item) {
            html += `<li id="item-${item.id}"
                 class="list-group-item d-flex justify-content-between align-items-center" >
                <div class="div">
                    <p class="d-inline">${item.itemName}</p>
                    <span class="badge badge-primary badge-pill">${item.itemCount}</span>
                    <span class="badge badge-success badge-pill">${item.itemPrice} $</span>
                </div>
                <a href="#" ><i class="fas fa-edit edit-item"></i></a>
            </li>`
        })

        // Insert List item
        document.querySelector(UISelector.itemList).innerHTML = html
    }

    const addListItem = function (item) {
        // show list item block
        showItems(UISelector.itemList, 'block')
        // Create li element
        const li = document.createElement('li');
        // Add class
        li.className = `list-group-item d-flex justify-content-between align-items-center`
        // Add ID
        li.id = `item-${item.id}`
        // Add HTML
        li.innerHTML = `
        <div class="div">
                    <p class="d-inline">${item.itemName}</p>
                    <span class="badge badge-primary badge-pill">${item.itemCount}</span>
                    <span class="badge badge-success badge-pill">${item.itemPrice} $</span>
        </div>
        <a href="#" ><i class="fas fa-edit edit-item"></i></a>`
        // Insert item
        document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)

    }


    const updateListItem = function (item) {
        let listItems = document.querySelectorAll(UISelector.listItems)

        // Turn Node list into array
        listItems = Array.from(listItems)

        listItems.forEach(function (listItem) {
            const itemID = listItem.getAttribute('id')

            if (itemID === `item-${item.id}`) {
                document.querySelector(`#${itemID}`).innerHTML = `
        <div class="div">
                    <p class="d-inline">${item.itemName}</p>
                    <span class="badge badge-primary badge-pill">${item.itemCount}</span>
                    <span class="badge badge-success badge-pill">${item.itemPrice} $</span>
        </div>
        <a href="#" ><i class="fas fa-edit edit-item"></i></a>`
            }
        })
    }

    const deleteListItem = function (id) {
        const itemID = `#item-${id}`
        const item = document.querySelector(itemID)
        item.remove()
    }

    const clearItems = function () {
        let listItems = document.querySelectorAll(UISelector.listItems)
        // Turn Node list into array
        listItems = Array.from(listItems)

        listItems.forEach(function (item) {
            item.remove()
        })
    }
    const getSelector = function () {
        return UISelector
    }

    const getItemsInput = function () {
        return {
            name: document.querySelector(UISelector.ItemNameInput).value,
            price: document.querySelector(UISelector.itemPriceInput).value,
            count: document.querySelector(UISelector.itemCountInput).value
        }
    }


    // Clear Inputs
    const clearInputs = function () {
        document.querySelector(UISelector.ItemNameInput).value = ''
        document.querySelector(UISelector.itemPriceInput).value = ''
        document.querySelector(UISelector.itemCountInput).value = ''
    }

    // Add item to form
    const addItemToForm = function () {
        showEditState()
        document.querySelector(UISelector.ItemNameInput).value = ItemController.getCurrentItem().itemName
        document.querySelector(UISelector.itemPriceInput).value = ItemController.getCurrentItem().itemPrice
        document.querySelector(UISelector.itemCountInput).value = ItemController.getCurrentItem().itemCount

        console.log(document.querySelector(UISelector.ItemNameInput))
        console.log(ItemController.getCurrentItem().itemName)
    }
    // Hide list
    const hideList = function () {
        hideItems(UISelector.itemList)
    }

    //show items
    const showItems = function (itemSlector, type) {
        document.querySelector(itemSlector).style.display = type

    }
    // hide items
    const hideItems = function (itemSlector) {
        document.querySelector(itemSlector).style.display = 'none'
    }
    // Clear Edit State
    const clearEditState = function () {
        clearInputs()
        hideItems(UISelector.updateBtn)
        hideItems(UISelector.deleteBtn)
        hideItems(UISelector.backBtn)
        showItems(UISelector.addBtn, 'inline')
        showItems(UISelector.clearAllBtn, 'inline')
    }
    // Show Edit State
    const showEditState = function () {
        clearInputs()
        showItems(UISelector.updateBtn, 'inline')
        showItems(UISelector.deleteBtn, 'inline')
        showItems(UISelector.backBtn, 'inline')
        hideItems(UISelector.addBtn)
        hideItems(UISelector.clearAllBtn)
    }
    // Show total price
    const showTotalPrice = function (total) {
        console.log(total)
        document.querySelector(UISelector.totalPrice).textContent = total
    }
    // show alert message 
    const showAlert = function (message, className) {
        // Clear any remaining alert
        clearAlert();
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = className;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent 
        const container = document.querySelector('#alert');
        // Get search box
        const card = document.querySelector('.card-body');
        // Insert alert
        container.insertBefore(div, card);

        // Timeout after 3 sec
        setTimeout(() => {
            clearAlert();
        }, 4000);
    }

    // clear Alert messge
    const clearAlert = function () {
        const currentAlert = document.querySelector('.alert');

        if (currentAlert) {
            currentAlert.remove();
        }
    }



    // Public Methods
    return {
        populateItems: populateItems,
        getSelector: getSelector,
        getItemsInput: getItemsInput,
        addListItem: addListItem,
        alert: showAlert,
        clearInputs: clearInputs,
        hideList: hideList,
        showTotalPrice: showTotalPrice,
        clearEditState: clearEditState,
        addItemToForm: addItemToForm,
        updateListItem: updateListItem,
        deleteListItem: deleteListItem,
        clearItems: clearItems
    }
})()















// App Controller
const MainController = (function (ItemController, UIController) {

    // Load event Listeners
    const loadEventListeners = function () {
        // Get Selector
        const UISelector = UIController.getSelector()

        // Add item event
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit)

        // Disable submit on eneter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })
        // Edit icon click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick)

        // Update item event
        document.querySelector(UISelector.updateBtn).addEventListener('click',
            itemUpdateSubmit)

        // Delete item event
        document.querySelector(UISelector.deleteBtn).addEventListener('click',
            itemDelete)

        // Clear All itens
        document.querySelector(UISelector.clearAllBtn).addEventListener('click',
            clearAllItemsClick)

        // Back button
        document.querySelector(UISelector.backBtn).addEventListener('click',
            function (e) {
                e.preventDefault()
                UIController.clearEditState()
            })
    }

    // Add item submit
    const itemAddSubmit = function (e) {
        e.preventDefault()
        // Get form inputs   
        const input = UIController.getItemsInput()
        const name = input.name
        const price = input.price
        const count = input.count
        if (!name || !price || !count) {
            UIController.alert('Please Fill all fields', 'alert alert-danger')
        } else {
            if (price < 0 || count < 0) {
                UIController.alert('Price and number of item must be positive', 'alert alert-danger')
            } else if (ItemController.uniqueName(name)) {
                UIController.alert('name must be unique', 'alert alert-danger')
            } else {
                // Add item to item controller
                const newItem = ItemController.addItem(name, price, count)
                // Add to UI List
                UIController.addListItem(newItem)
                UIController.alert('Item added successfully', 'alert alert-success')

                // Store in localStorage
                StorageCtrl.storeItem(newItem);

                // Clear fields
                UIController.clearInputs()
            }

        }

        // Get total price
        const totalPrice = ItemController.getTotalPrice()

        // Add total Price to UI 
        UIController.showTotalPrice(totalPrice)
    }




    // Click edit item 
    const itemEditClick = function (e) {
        e.preventDefault()
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id

            // Break into an array 
            const listIdArr = listId.split('-')

            // Get the actual id
            const id = parseInt(listIdArr[1])

            // Get item
            const itemToEdit = ItemController.getItemById(id)

            // Set current item
            ItemController.setCurrentItem(itemToEdit)
            ItemController.dataLog()
            // Add item to form
            UIController.addItemToForm()
        }
    }

    // Update item submit
    const itemUpdateSubmit = function (e) {
         e.preventDefault()
        // Get item input
        const input = UIController.getItemsInput()

        // update item
        const updatedItem = ItemController.updateItem(input.name, input.price, input.count)

        // Updat UI
        UIController.updateListItem(updatedItem)

        // Get total price
        const totalPrice = ItemController.getTotalPrice()

        // Add total Price to UI 
        UIController.showTotalPrice(totalPrice)

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UIController.clearEditState()
       
    }

    // Delete button event
    const itemDelete = function (e) {
        e.preventDefault()
        // Get current item
        const currentItem = ItemController.getCurrentItem()

        // Delete from state
        ItemController.deleteItem(currentItem.id)

        // Delte from UI
        UIController.deleteListItem(currentItem.id)

        // Get total price
        const totalPrice = ItemController.getTotalPrice()

        // Add total Price to UI 
        UIController.showTotalPrice(totalPrice)

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UIController.clearEditState()
    }

    // Clear All items event
    const clearAllItemsClick = function (e) {
        e.preventDefault()
        // Delete all items from state
        ItemController.deleteAllItems()



        // Get total price
        const totalPrice = ItemController.getTotalPrice()

        // Add total Price to UI 
        UIController.showTotalPrice(totalPrice)

        UIController.clearEditState()


        // Remove from UI
        UIController.clearItems()

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        // Hide UL
        UIController.hideList()
        
    }
    const initApp = function () {
        // set intial state
        UIController.clearEditState()
        // Fetch Items
        const items = ItemController.getItems()

        if (items.length === 0) {
            UIController.hideList()
        } else {
            // Populate List with items
            UIController.populateItems(items)
        }

        // Get total price
        const totalPrice = ItemController.getTotalPrice()

        // Add total Price to UI 
        UIController.showTotalPrice(totalPrice)

        // Load event listeners
        loadEventListeners()
    }
    // Public Methods
    return {
        init: initApp
    }
})(ItemController, UIController)

// Intialize App
MainController.init()