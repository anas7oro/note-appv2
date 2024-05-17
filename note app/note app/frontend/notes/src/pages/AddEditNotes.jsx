import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';

const AddEditNotes = ({ noteData, getAllNotes, type, onClose }) => {
    const [title, setTitle] = useState(noteData?.title || '');
    const [content, setContent] = useState(noteData?.content || '');
    const [error, setError] = useState(null);

    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/api/addNote', {
                title,
                content,
            });
            if (response.data.message) {
                getAllNotes();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const editNote = async () => {
        const noteId = noteData.id;
        try {
            const response = await axiosInstance.put(`/api/editNote/${noteId}`, {
                title,
                content,
            });
            if (response.data.message) {
                getAllNotes();
                onClose(); // Close modal on successful note edit
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

  

    const handleAddNote = () => {
        if (!title) {
            setError('Title is missing');
            return;
        }
        if (!content) {
            setError('Content is missing');
            return;
        }

        setError('');

        if (type === 'edit') {
            editNote();
        } else {
            addNewNote();
        }
    };

    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
                onClick={onClose}
            >
                <MdClose className='test-xl text-slate-400' />
            </button>

            <div className='flex flex-col gap-2'>
                <label className='input-label'>Title</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Content</label>
                <textarea
                    type='text'
                    className='text-sm text-slate-950 outline-none bg-state-50 p-2 rounded'
                    placeholder='Content'
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    );
};

export default AddEditNotes;
