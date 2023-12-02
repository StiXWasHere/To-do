const addItem = document.querySelector("#addItem")
const itemForm = document.querySelector("#newItem")
const btnAdd = document.querySelector("#btnAdd")
const list = document.querySelector("#list")
const errorMessage = document.querySelector("#addItemError")
const modal = document.querySelector("#modal")
const modalContent = document.querySelector("#modalContent")
let displayItems = [] //Array to which my items are saved

const itemById = async (id) => { //This function is used to target a specific item within the displayItems array
  const item = await displayItems.find(item => item._id === id)

  return item
}


itemForm.addEventListener("submit", (e) => {
  e.preventDefault()

  if (!addItem.value.trim()) {
    errorMessage.style.display = "block"
    return
  }

  const postValue = addItem.value
  async function createAndLoad () {
    await postItem(postValue)
  }
  createAndLoad()
  addItem.value = ""
  addItem.focus()

  errorMessage.style.display = "none"
})

function createItemElement(todo) {
  const item = document.createElement("div")
  item.classList.add("item")
  item.id = todo._id

  const itemText = document.createElement("span")
  itemText.textContent = todo.title
  itemText.classList.add("itemText")
  itemText.contentEditable = false

  item.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  const completionBox = document.createElement("i")
  completionBox.textContent = ""
  completionBox.classList.add("fa-solid", "fa-check")

  completionBox.addEventListener("click", (e) => {
    e.stopPropagation()
    completionBox.classList.toggle("done")
    console.log(completionBox.classList)
    if (completionBox.classList.contains('fa-solid') && completionBox.classList.contains('fa-check') && completionBox.classList.contains('done')) {
      console.log("done")
      itemText.style.textDecoration = "line-through"
      itemText.style.textDecorationThickness = "1px"
      todo.complete = true
      updateItemCompletion(todo._id, todo.complete)
    } 
    else {
      itemText.style.textDecoration = "none"
      todo.complete = false
      updateItemCompletion(todo._id, todo.complete)
    }
  })

  if (todo.completed === true) {
    itemText.style.textDecoration = "line-through"
    itemText.style.textDecorationThickness = "1px"
    completionBox.classList.add("fa-solid", "fa-check", "done")
  } else {
    itemText.style.textDecoration = "none"
  }

  const deleteItemBtn = document.createElement("i")
  deleteItemBtn.textContent = " "
  deleteItemBtn.classList.add("fa-solid", "fa-trash")

  deleteItemBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (completionBox.classList.contains('fa-solid') && completionBox.classList.contains('fa-check') && completionBox.classList.contains('done')) {
        deleteItem(todo._id)
        console.log(todo._id)
        item.remove()
        console.log("removed item")
      }
      else {
        console.log("Could not delete item")
        modal.showModal()
      }
  })

  modal.addEventListener("click", (e) => {
    e.stopPropagation()
    modal.close()
  })

  const editItemBtn = document.createElement("i")
  editItemBtn.textContent = " "
  editItemBtn.classList.add("fa-solid", "fa-pen")

  const saveBtn = document.createElement("button")
  saveBtn.textContent = "Save"
  saveBtn.classList.add("saveBtn")
  saveBtn.style.display = "none"

  editItemBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    itemText.contentEditable = true
    itemText.spellcheck = false
    itemText.focus()
    saveBtn.style.display = "block"

    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      itemText.contentEditable = false
      saveBtn.style.display = "none"
      console.log(itemText.textContent)
      updateItem(todo._id, itemText.textContent)
    })
    console.log("Edited item")
  })

  itemText.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      itemText.contentEditable = false
      saveBtn.style.display = "none"
      console.log(itemText.textContent)
      updateItem(todo._id, itemText.textContent)
    }
  })

  item.appendChild(completionBox)
  item.appendChild(itemText)
  item.appendChild(saveBtn)
  item.appendChild(editItemBtn)
  item.appendChild(deleteItemBtn)

  return item
}

const getItems = async () => {
  const res = await fetch("https://js1-todo-api.vercel.app/api/todos?apikey=5361d7da-df6c-4225-a054-33e26cb2f68c", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status !== 200) {
    console.log("Error:", res.status)
    return
  }

  let data = await res.json()
  displayItems = data

  console.log(displayItems)
  
  await fetchItemInformation()
}

getItems()

async function fetchItemInformation() {
  list.innerHTML = ""
  displayItems.forEach(item => {
    list.appendChild(createItemElement(item))
  })
}

const getOneItem = async (id) => {
  const res = await fetch("https://js1-todo-api.vercel.app/api/todos/" + id + "?apikey=5361d7da-df6c-4225-a054-33e26cb2f68c", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status !== 200) {
    console.log("Error:", res.status)
    return
  }

  let data = await res.json()
  displayItems.push(data)
  list.appendChild(createItemElement(data))
  return data
}

const postItem = async (value) => {
  const res = await fetch("https://js1-todo-api.vercel.app/api/todos?apikey=5361d7da-df6c-4225-a054-33e26cb2f68c", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
        title: `${value}`
      })
  })

  if(res.status === 201) {
    console.log("success")
  }else {
    console.log("error", res.status)
    return
  }

  const data = await res.json()
  console.log(data)

  getOneItem(data._id)
  return data
}

const updateItem = async (id, value) => {
  const res = await fetch("https://js1-todo-api.vercel.app/api/todos/" + id + "?apikey=5361d7da-df6c-4225-a054-33e26cb2f68c", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
        title: `${value}`
      })
  })
  if (res.status !== 200) {
    console.log("Error:", res.status)
    return
  }

  let data = await res.json()
  console.log(data)

  return data
}

const updateItemCompletion = async (id, value) => {
  const res = await fetch("https://js1-todo-api.vercel.app/api/todos/" + id + "?apikey=5361d7da-df6c-4225-a054-33e26cb2f68c", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
        completed: `${value}`
      })
  })
  if (res.status !== 200) {
    console.log("Error:", res.status)
    return
  }

  let data = await res.json()
  console.log(data.completed)

  const target = await itemById(id)
  
  target.completed = data.completed

  return data
}

const deleteItem = async (id) => {
  console.log(id)
  const res = await fetch("https://js1-todo-api.vercel.app/api/todos/" + id + "?apikey=5361d7da-df6c-4225-a054-33e26cb2f68c", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if(res.status !== 200) {
    console.log("error", res.status)
    return
  }

  const data = await res.json()
}



