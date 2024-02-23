const apiBaseUrl = 'https://65b8db22b71048505a899dd1.mockapi.io/api/v1/notes';

//! Create Note
const createNote = async (note) => {
    const resp = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(note),
    });
    const data = await resp.json();
    return data;
};

//! Delete Notes
const deleteNote = async (id) => {
    const resp = await fetch(`${apiBaseUrl}/${id}`, {
        method: 'DELETE',
    });
    const data = await resp.json();
    return data;
};

//! Get Notes
const getNotes = async () => {
    const resp = await fetch(apiBaseUrl);
    const data = await resp.json();
    return data;
};

export { createNote, deleteNote, getNotes };
