let form = document.forms[0];
let name_input = document.querySelector('input.name');
let grade_input = document.querySelector('input.grade');
let search_input = document.querySelector('input.search');
let tbody = document.querySelector('table tbody');

let grades = ['A', 'A+', 'B', 'B+', 'C', 'C+', 'D', 'D+', 'F'];
let data = [];

// Get Data From Local Storage If Exists :)
if (localStorage.getItem('data')) {
    data = JSON.parse(localStorage.getItem('data'));
    renderTable(data);
}

// Add New Student :)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let [username, grade, canContinue] = inputsValidation();

    if (canContinue) {
        let newData = {
            id: +data[Math.max(data.length - 1, 0)]?.id + 1 || 0,
            username: username.toLowerCase(),
            grade: grade.toLowerCase()
        }

        data = [...data, newData];

        localStorage.setItem('data', JSON.stringify(data));
        renderTable(data);
        clearInputs();
    }
});

// Display Data In Table :)
function renderTable(data) {
    while (tbody.firstElementChild) {
        tbody.firstElementChild.remove();
    }
    for (const person of data) {
        let { id, username, grade } = person
        let tr = document.createElement('tr');
        tr.id = id;
        let trContent = `
            <td title="${username}">${username}</td>
            <td>${grade}</td>
            <td>
                <button class="edit" id=${id} onclick="editStudent(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete" id=${id} onclick="deleteStudent(this)"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    }
}

// Handle Delete Button :)
function deleteStudent(btn) {
    data = data.filter(p => p.id != btn.id);
    localStorage.setItem('data', JSON.stringify(data));
    addAnimation(document.getElementById(btn.id), 'delete', 300, true);
}

// Handle Edite Button :)
function editStudent(btn) {
    let person = data.find(p => p.id == btn.id);
    name_input.value = person.username;
    grade_input.value = person.grade;
    changeFormData('edit', 'add', person.id);
    window.scrollTo({ top: 50, behavior: "smooth" });
}

// Handle Close Button :)
function closeEdit() {
    changeFormData('add', 'edit', '');
    name_input.classList.remove('wrong');
    grade_input.classList.remove('wrong');
    clearInputs();
}

// Handle Update Button :)
function update() {
    let [username, grade, canContinue] = inputsValidation();

    if (canContinue) {
        let newData = {
            id: form.id,
            username: username.toLowerCase(),
            grade: grade.toLowerCase()
        }

        data = data.map(p => p.id == form.id ? newData : p);

        localStorage.setItem('data', JSON.stringify(data));
        renderTable(data);
        clearInputs();
        closeEdit();
        let tr = document.getElementById(newData.id);
        tr.scrollIntoView({ behavior: "smooth", block: "nearest" });
        addAnimation(tr, 'update', 300);
    }
}

// Handle Main From Validation :)
function inputsValidation() {
    let [username, empty_name] = isInputEmpty(name_input);
    let [grade, empty_grade] = isInputEmpty(grade_input);
    let canContinue = !empty_name && !empty_grade && grades.includes(grade.toUpperCase());
    !grades.includes(grade.toUpperCase()) ? grade_input.classList.add('wrong') : grade_input.classList.remove('wrong');
    return [username, grade, canContinue];
}

// Check If Input Field Is Empty :)
const isInputEmpty = (input) => {
    let value = input.value.trim();
    let empty = false;
    if (value === '') {
        input.classList.add('wrong');
        empty = true;
    } else input.classList.remove('wrong');
    return [value, empty];
}

// Handle Search Button :)
function searchButton(btn) {
    btn.parentElement.parentElement.classList.toggle('active');
    search_input.value = '';
    renderTable(data);
}

// Handle Search Field :)
function handleTyping(field) {
    let radioButton = document.querySelector('input[name="search"]:checked');
    search_input.scrollIntoView({ behavior: "smooth", block: "center" });
    if (radioButton) {
        let searchType = radioButton.dataset.type === 'name' ? 'username' : 'grade';
        let searchText = field.value.toLowerCase().trim();
        let data_after_search = data.filter(p => {
            return p[searchType].includes(searchText);
        });

        renderTable(data_after_search);
    }
}

// Change Search Field Placeholder
function radioButtonHandle(radioButton) {
    let searchType = radioButton.dataset.type;
    search_input.setAttribute('placeholder', 'Enter ' + searchType);
}

// Clear Input Fields :)
function clearInputs() {
    name_input.value = '';
    grade_input.value = '';
}

// Change Form Class & Id :)
function changeFormData(addClass, removeClass, id) {
    form.classList.add(addClass);
    form.classList.remove(removeClass);
    form.id = id;
}

// Add Animation :)
function addAnimation(element, animation, timeToClose, render) {
    element.classList.add(animation);
    setTimeout(() => {
        element.classList.remove(animation);
        if (render) renderTable(data);
    }, timeToClose);
}