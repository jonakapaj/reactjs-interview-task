import React from 'react';
import jsonData from './data.json';

const NoteList = ({ currentCatIndex, categories, searchTerm, setSearchTerm, selectedNote, deleteNote }) => {
    const allNotes = jsonData.concat(categories[currentCatIndex]?.notes || []);

    return (
        <div className="col-4 p-2 border rounded shadow ">
            {currentCatIndex !== null && (
                <div>
                    <div className='searchi'>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            className="form-control my-1"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul style={{listStyleType: 'none', padding: 0}}>
                        {allNotes
                            .filter(item => (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) || (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())))
                            .map((item, index) => (
                                <li key={index} className="border border-dark-subtle rounded my-1 p-2 "
                                    onClick={() => selectedNote(index >= jsonData.length ? index - jsonData.length : index)}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h4>{item.title}</h4>
                                        <i onClick={(e) => {
                                            e.stopPropagation();
                                            if(item._id) {
                                                deleteNote(item._id);
                                            }
                                        }} className="fa fa-trash" style={{fontSize: "20px", color: "red"}}></i>
                                    </div>
                                    <p>{item.content}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NoteList;
