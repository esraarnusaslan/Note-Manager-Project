import { createNote, deleteNote, getNotes } from './service.js';

//? EVENT FUNCTIONS
//! Turn Dark Mode On/Off
const btnDarkMode = document.getElementById('btnDarkMode');
btnDarkMode.addEventListener('click', () => {
    document.querySelector('body').classList.toggle('dark-mode');
    const btnDarkMode = document.querySelector('#btnDarkMode i');
    btnDarkMode.classList.toggle('fa-moon');
    btnDarkMode.classList.toggle('fa-sun');
});

//! Hide Add Note Form
document.getElementById('btnHideForm').addEventListener('click', () => {
    toggleAddNoteForm();
});

//! Open and close add note icon
document.getElementById('btnShowAddNoteForm').addEventListener('click', () => {
    toggleAddNoteForm();
});

//! Add Note
document.getElementById('btnAddNote').addEventListener('click', async () => {
    const titleEl = document.getElementById('title');
    const noteEl = document.getElementById('note');
    const colorEl = document.querySelector('[name="colors"]:checked');

    try {
        const title = titleEl.value;
        const note = noteEl.value;
        const color = colorEl.id;

        //* Validation
        if (!title) throw new Error('Please enter a title');
        if (!note) throw new Error('Please enter a note');
        color ??= 'light'; //color=color ?? "light"

        //* Add Note with API
        const newNote = {
            title,
            note,
            color,
        };

        const data = await createNote(newNote);
        const row = document.querySelector('#board .row');

        //* Add Card
        createNoteElement(data, row);

        //* Reset Form
        resetAddNoteForm(titleEl, noteEl);
    } catch (error) {
        alert(error.message);
    }
});

//? OTHER FUNCTIONS
//! Show/Hide Add Note Form
const toggleAddNoteForm = () => {
    document.querySelector('.add-note-form').classList.toggle('d-none');
    const btnShowAddNoteForm = document.querySelector('#btnShowAddNoteForm i');
    btnDarkMode.classList.toggle('d-none');
    btnShowAddNoteForm.classList.toggle('fa-plus');
    btnShowAddNoteForm.classList.toggle('fa-times');
};

//! Load Note
const loadNotes = async () => {
    const row = document.querySelector('#board .row');
    row.innerHTML = '';
    showLoader();

    try {
        const notes = await getNotes();

        notes.forEach((item) => {
            createNoteElement(item, row);
        });
    } catch (error) {
        console.log(error.message);
    } finally {
        hideLoader();
    }
};

//! Remove Element
const remoteNoteElement = async (id) => {
    try {
        const result = confirm('Are you sure you want to delete this note?');
        if (!result) return;
        showLoader();

        const deletedData = await deleteNote(id);
        const noteEl = document.querySelector(
            `div[data-id="${deletedData.id}"]`
        );
        noteEl.remove();
    } catch (error) {
        alert(error.message);
    } finally {
        hideLoader();
    }
};

//! Create Note HTML
const createNoteHtml = (data) => {
    return ` 
    <div class="col" data-id="${data.id}">
        <div class="card bg-${data.color} shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>${data.title}</div>
                <div class="text-end">
                <button class="btn btn-danger"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="card-body">
                ${data.note}
            </div>
        </div>
    </div>`;
};

//! Create Note Element
const createNoteElement = (data, row) => {
    const newNoteHtml = createNoteHtml(data);

    row.insertAdjacentHTML('afterbegin', newNoteHtml); //card is in DOM

    const deleteButton = row.querySelector(`div[data-id="${data.id}"] button`);

    deleteButton.addEventListener('click', () => {
        remoteNoteElement(data.id);
    });
};

//! Reset Form
const resetAddNoteForm = (titleEl, noteEl) => {
    titleEl.value = '';
    noteEl.value = '';
    document
        .querySelectorAll('[name="colors"]:checked')[0]
        .setAttribute('checked', 'true');
    toggleAddNoteForm();
};

//! Show Loader
const showLoader = () => {
    document.querySelector('#loader').style.display = 'flex';
};

//! Hide Loader
const hideLoader = () => {
    document.querySelector('#loader').style.display = 'none';
};

loadNotes();
