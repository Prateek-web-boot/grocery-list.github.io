


// ************************ SELECT ITEMS ********************************
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option

let editElement;
let editFlag = false;
let editID = "";

// ************************ EVENT LISTENERS *****************************

// form event
form.addEventListener('submit', addItem);

// clear btn event
clearBtn.addEventListener('click', clearList);

// Load items on app restart
window.addEventListener('DOMContentLoaded', setUpItem);

// **************************** FUNCTIONS *********************************
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if(value !== "" && !editFlag)
    {

        // function call for creating the list items
        createListItems(id, value);

        // display alert
        displayAlert("item added", "success");

        //display container
        container.classList.add('show-container');

        //addToLocalStorage
        addToLocalStorage(id, value);

        //set to default
        setToDefault();

    }
    else if(value !== "" && editFlag)
    {
        editElement.innerHTML = value;
        displayAlert('item edited', 'success');
        
        editLocalStorage(editID, value);
        setToDefault();

    }
    else if(!value){
        displayAlert("please enter value", "danger");
    }
}

//display alert
function displayAlert(text, action) {

    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(() => {

        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);

    }, 1000);
}


// clear List 
function clearList() {

    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0)
    {
        items.forEach( (i) => {
            list.removeChild(i);
        });
    }
    

    //hiding the clear ALL button
    container.classList.remove("show-container");

    //display alert
    displayAlert("List cleared !", "success");

    setToDefault();

    localStorage.removeItem('list');

}

// delete item function

function deleteItem(e) 
{
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if (list.children.length === 0)
    {
        container.classList.remove('show-container');
    }

    displayAlert('item deleted', 'danger');

    setToDefault();

    // remove from local storage
    removeFromLocalStorage(id);

}

// edit item function

function editItem(e)
{
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;

    submitBtn.textContent = "edit";

}


// set to default
function  setToDefault() {
    grocery.value = " ";
    editFlag = false;
    editID = "";
    submitBtn.textContent = 'submit';
}


// ********************** LOCAL STORAGE *************************


// set to Local storage
function addToLocalStorage (id, value) {

    // const grocery = {id:id, value:value};  // this a+is also the way to create the object
    const grocery = {id, value};

    // here we see that is any list exist in localstorage then return that in form of array else return an empty array
    let items = getLocalStorage();

    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
}

// remove from local storage function

function removeFromLocalStorage(id)
{
    let items = getLocalStorage();
    
    items = items.filter( (p) => {
        if(p.id !== id)
        {
            return p;
        }
    });

    //overwriting the original array

    localStorage.setItem('list', JSON.stringify(items));
}

// edit local storage

function editLocalStorage(editID, value)
{
    let items = getLocalStorage();

    items = items.map((item) => {

        if (item.id === editID)
        {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem('list', JSON.stringify(items));
}


function getLocalStorage()
{
    return localStorage.getItem('list') 
    ? JSON.parse(localStorage.getItem('list')) 
    : []; 
}

// *************************** SETUP ITEMS ******************************


function setUpItem()
{
    let items = getLocalStorage();

    if (items.length > 0)
    {
        items.forEach((item) => {
            createListItems(item.id, item.value);
        });
    
        container.classList.add('show-container');
    }

    
}

function createListItems(id, value)
{
        // create element
        const element = document.createElement('article');
        
        // add id
        let attr = document.createAttribute('data-id');
        attr.value = id;
        // adding attribute to the main element
        element.setAttributeNode(attr);
        // add class
        element.classList.add('grocery-item');

        element.innerHTML = `
        <p class="title">${value}</p>
          
        <div class="btn-container">

          <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>

          <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
    `;

        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteItem);

        const editBtn = element.querySelector('.edit-btn');
        editBtn.addEventListener("click", editItem);


        // add item to list
        list.appendChild(element);
}
