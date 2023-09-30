import React from 'react';


const NoteEditor = ({ currentCatIndex, noteTitle, setNoteTitle, noteContent, setNoteContent, isEditing, updateNote, saveNoteToCategory }) => (
    <div className="col-5 p-2 border rounded shadow">
        {currentCatIndex !== null && (
            <div>
                <h2 className=' text-center  border rounded shadow-sm mx-5'>Create new note</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={noteTitle}
                    className="form-control my-1"
                    onChange={e => setNoteTitle(e.target.value)}
                />
                <div>
                    <textarea
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                        className="rounded form-control"
                        placeholder="Your Note"
                        rows="10"
                    />
                </div>

                {isEditing
                    ? <button className="btn btn-success my-2" onClick={updateNote}>Update Note</button>
                    : <button className="btn btn-success my-2" onClick={saveNoteToCategory}>Save
                        Note</button>}
            </div>
        )}
    </div>
);

export default NoteEditor;
