"use client";

import React, { useState } from 'react';
import { getNotesByOwner, addNote, deleteNote } from "../../services/notes";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { Loader } from '@/components';

const NotesPage = () => {
    const queryClient = useQueryClient();
    const user = localStorage.getItem("user");
    const uid = user ? JSON.parse(user).uid : null;
    const { data, isLoading, isFetching, error } = useQuery("notes", () => getNotesByOwner(uid));
    const [input, setInput] = useState("");

    const deleteMutation = useMutation((id: string) => deleteNote(id), {
        onMutate: async (id: string) => {
            await queryClient.cancelQueries('notes')
            const previousNotes = queryClient.getQueryData('notes')
            queryClient.setQueryData('notes', (old: any) => old.filter((item: any) => item._id != id))
            return { previousNotes }
        },
        onSuccess: () => {
            queryClient.invalidateQueries('notes')
        }
    })

    const addMutation = useMutation((note: any) => addNote(note), {
        onMutate: async (note: any) => {
            await queryClient.cancelQueries('notes')
            const previousNotes = queryClient.getQueryData('notes')
            queryClient.setQueryData('notes', (old: any) => [...old, note])
            return { previousNotes }
        },
        onSuccess: () => { queryClient.invalidateQueries('notes') }
    })
    
    const handleChange = (event: any) => { setInput(event.target.value) }

    return (
        <div className='full-width'>
            {(isFetching || isLoading) && <Loader />}
            <h1>Notes</h1>
            <div className='notes-grid-container '>
                <div className='grid-item'>
                    <textarea onChange={handleChange} value={input} />
                    <div className='row-r'>
                        <button onClick={() => addMutation.mutate({ text: input, owner: uid })}>
                            <LuArrowRight style={{ color: 'white', backgroundColor: '#6FC21C', width: '46px', height: '30px', borderRadius: '5px', gap: '10px', padding: '5px' }} />
                        </button>
                    </div>
                </div>
                {
                    data && data.map((note: any, idx: number) => (
                        <div className='grid-item' key={idx}>

                            <button className="row-r" onClick={() => deleteMutation.mutate(note._id)}><Image src="icons/trash.svg" alt="Delete" width={18} height={18} /></button>

                            {deleteMutation.isError && <div>Something went wrong</div>}
                            <div>{note.text}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default NotesPage;
