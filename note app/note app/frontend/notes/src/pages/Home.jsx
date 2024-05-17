import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import NoteCard from '../components/cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [allNotes , setAllNotes] = useState([])
    const [userInfo , setUserInfo] = useState(null); // Corrected useState syntax

    const navigate = useNavigate();

    const handleEdit = (noteDetails) =>{
        setOpenAddEditModal({ isShown: true , data: noteDetails , type:"edit"})
    }
    //get user info 
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/api/getUser");
            if(response.data){
                setUserInfo(response.data);
            }
        } catch (error) {
            if(error.response.status === 500){
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    //get notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/api/myNotes")
            console.log(response.data.notes)
            if(response.data && response.data.notes){
                setAllNotes(response.data.notes)
            }
        } catch (error) {
            console.log("error")
        }
    }
    //delete note
    const deleteNote = async (data) =>{
        const noteId = data.id;
          try {
              const response = await axiosInstance.delete(`/api/deleteNote/${noteId}`);
              if (response.data.message) {
                  getAllNotes();
                  alert(response.data.message)
              }
          } catch (error) {
            console.log("error")
          }
      }



    useEffect(() => { 
        getAllNotes()
        getUserInfo();
        return () => {};
    }, []); // Added missing semicolon

    return (
        <>
            <Navbar userInfo={userInfo}/>

            <div className='container mx-auto'>
                <div className='grid grid-cols-3 gap-4 mt-8'>
                {allNotes.map((item , index) => (
                        <NoteCard
                            key={item.id}
                            title={item.title}
                            content={item.content}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => deleteNote(item)}
                        /> 
                    ))}
                </div>
            </div>

            <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
                onClick={() => {
                    setOpenAddEditModal({isShown: true , type: "add" , data: null});
                }}>
                <MdAdd className='text-[32px] text-white' />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabels=""
                className="w-[40%] max-h-3/4 bg-white rounded mx-auto mt-14 p-5 "
            >

                <AddEditNotes 
                type = {openAddEditModal.type}
                noteData={openAddEditModal.data}
                onClose={() => {
                    setOpenAddEditModal({isShown: false , type: "add" , data: null});
                }}
                getAllNotes={getAllNotes}
                />
            </Modal>


        </>
    );
};

export default Home;
