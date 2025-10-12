import ToDoList from './todolist.js';
import ToDoItem from './todoitems.js';

const toDoList = new ToDoList();


// Launch App
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        initApp();
    }
})

const initApp = () => {
    // Add Event Listeners
    const formEnt = document.getElementById('form');
    formEnt.addEventListener('submit', (event) => {
        event.preventDefault();
        processSubmission();
    });
    const clearListBtn = document.getElementById('clearListBtn');
    clearListBtn.addEventListener('click', (event) => {
        const list = toDoList.getList();
        if (list.length) {
            const confirmClear = confirm('Are you sure you want to clear the entire list?');
            if (confirmClear) {
                toDoList.clearList();
                updatePersistentStorage(toDoList.getList());
                refreshThePage();
            }
        }
    });
    loadListFromStorage();
    refreshThePage();
}

const loadListFromStorage = () => {
    const storedList = localStorage.getItem('toDoList');
    if (typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(item => {
        const newToDoItem = createNewItem(item._id, item._item);
        toDoList.addItemToList(newToDoItem);
    });
}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemInput();
    focusItemInput();
}

const clearListDisplay = () => {
    const parentEl = document.querySelector('.container');
    deleteContent(parentEl);
}

const deleteContent = (parentEl) => {
    let child = parentEl.lastElementChild;
    while (child) {
        parentEl.removeChild(child);
        child = parentEl.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    })
}

const buildListItem = (item) => {
    const div = document.createElement('div');
    div.className = 'item';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckBox(check);
    const label = document.createElement('label');
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.querySelector('.container');
    container.appendChild(div);
};

const addClickListenerToCheckBox = (checkbox) => {
    checkbox.addEventListener('click', (event) => {
        toDoList.removeItemFromList(checkbox.id);
        // remove list item from DOM
        setTimeout(() => {
            refreshThePage();
        },1000)
    });
}

const updatePersistentStorage = (listArr) => {
    localStorage.setItem('toDoList', JSON.stringify(listArr));
}

const clearItemInput = () => {
    document.getElementById('newItem').value = '';
}


const focusItemInput = () => {
    document.getElementById('newItem').focus();
}

const processSubmission = () => {
    const newEntry = getNewEntry();
    if (!newEntry.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntry);
    toDoList.addItemToList(toDoItem);
    updatePersistentStorage(toDoList.getList());
    refreshThePage();
}

const getNewEntry = () => {
    return document.getElementById('newItem').value.trim();
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

const createNewItem = (itemId, text) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(text);
    return toDo;
}