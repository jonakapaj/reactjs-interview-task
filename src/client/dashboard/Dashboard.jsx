import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import CategoriesList from './CategoriesList';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import {toast} from "react-toastify";

const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const [currentCatIndex, setCurrentCatIndex] = useState(null);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedNoteButton, setSelectedNoteButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [logOut, setLogOut] = useState(null)


    const token = localStorage.getItem('token');

    const selectCategory = (catIndex) => {
        setCurrentCatIndex(catIndex);
        setSelectedButton(catIndex);
        setIsEditing(false);
    };

    const selectedNote = (noteIndex) => {
        console.log(noteIndex)
        if (noteIndex < 0) {
            setIsEditing(false);
            return;
        }
        if (categories[currentCatIndex] && categories[currentCatIndex].notes && noteIndex < categories[currentCatIndex].notes.length) {
            const selectedNote = categories[currentCatIndex].notes[noteIndex];

            setCurrentNoteIndex(noteIndex);
            setSelectedNoteButton(noteIndex);
            setNoteTitle(selectedNote.title);
            setNoteContent(selectedNote.content);
            setIsEditing(true);
        } else {
            setIsEditing(false);
            console.error('Error selecting note: invalid category or note index ' + noteIndex);
        }
    };

    const updateNote = async () => {
        if (currentCatIndex !== null && currentNoteIndex !== null) {
            try {
                const noteId = categories[currentCatIndex].notes[currentNoteIndex]._id;

                const response = await axios.put(`http://localhost:3000/note/${noteId}`, {
                    title: noteTitle,
                    content: noteContent
                }, {
                    headers: {
                        'Authorization': token
                    }
                });

                const updatedCategories = [...categories];
                updatedCategories[currentCatIndex].notes[currentNoteIndex] = response.data;
                setCategories(updatedCategories);
                setIsEditing(false);
                toast.success("Note updated!");

            } catch (error) {
                toast.error('Error updating note.');
                console.error('Error updating note:', error);
            }
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categories', {
                    headers: {
                        'Authorization': token
                    }
                });
                if (response.status === 403) {
                    navigate('/');
                } else {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const createCategory = async () => {
        try {
            const response = await axios.post('http://localhost:3000/category',
                {name: 'Category'},
                {
                    headers: {
                        'Authorization': token
                    }
                }
            );
            setCategories(prevCategories => [...prevCategories, response.data]);
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const saveNoteToCategory = async () => {
        if (currentCatIndex !== null && noteTitle && noteContent) {
            try {
                const category = categories[currentCatIndex];
                const response = await axios.post('http://localhost:3000/note',
                    {
                        title: noteTitle,
                        content: noteContent,
                        categoryId: category._id,
                    }, {
                        headers: {
                            'Authorization': token
                        }
                    });
                category.notes.push(response.data);
                setCategories([...categories]);
                setNoteTitle('');
                setNoteContent('');
                toast.success("Note Saved")
            } catch (error) {
                toast.error("Note not saved, please try again!")
                console.error('Error creating note:', error);
            }
        }
        setIsEditing(false);
    };

    const deleteNote = async (noteId) => {
        try {
            await axios.delete(`http://localhost:3000/note/${noteId}`, {
                headers: {
                    'Authorization': token
                }
            });
            const updatedCategories = [...categories];
            updatedCategories[currentCatIndex].notes = updatedCategories[currentCatIndex].notes.filter(note => note._id !== noteId);
            setCategories(updatedCategories);
            toast.success("Note Deleted Successfully")
        } catch (error) {
            toast.error("Can't delete or update first 5 notes!!");
            console.error('Error deleting note:', error);
        }
    };
    const logOutUser = async () => {

        localStorage.removeItem("token")
        navigate("/")

    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="bg-dark border shadow text-white p-3 d-flex justify-content-between align-items-center">
                    <h1 className="mb-0">My Notes App</h1>
                    <button onClick={logOutUser} className="btn btn-danger">Sign Out</button>
                </div>

                <CategoriesList
                    categories={categories}
                    selectCategory={selectCategory}
                    selectedButton={selectedButton}
                    createCategory={createCategory}
                />
                <NoteList
                    currentCatIndex={currentCatIndex}
                    categories={categories}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedNote={selectedNote}
                    deleteNote={deleteNote}
                />
                <NoteEditor
                    currentCatIndex={currentCatIndex}
                    noteTitle={noteTitle}
                    setNoteTitle={setNoteTitle}
                    noteContent={noteContent}
                    setNoteContent={setNoteContent}
                    isEditing={isEditing}
                    updateNote={updateNote}
                    saveNoteToCategory={saveNoteToCategory}
                />
            </div>
        </div>
    );
};
export default Dashboard;
