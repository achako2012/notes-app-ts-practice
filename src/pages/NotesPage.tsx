import React, { useEffect, useState } from 'react';
import { Button, UncontrolledCollapse } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { TableCaption } from '../components/table-caption/TableCaption';
import { NoteView } from '../components/note/NoteView';
import './NotesList.scss';
import { getRandomDigit } from '../helpers/utils';
import { Category, Note, NoteStatus } from '../types';
import { Counter } from '../components/counter/Counter';
import { NotesState } from '../redux/rootReducer';

import { addNote, changeNote, deleteNote } from '../redux/actions';

export const NotesPage = () => {
    const [activeNotes, setActiveNotes] = useState<Note[]>();
    const [archivedNotes, setArchivedNotes] = useState<Note[]>();

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const state = useSelector<NotesState, NotesState['notes']>((state) => state.notes);
    const dispatch = useDispatch();

    console.log(state);

    useEffect(() => {
        setActiveNotes(state.filter((elem) => elem.status === NoteStatus.Active));
        setArchivedNotes(state.filter((elem) => elem.status === NoteStatus.Archived));
    }, [state]);

    const onAddNote = () => {
        const id = getRandomDigit();
        const emptyNote = {
            id,
            name: '',
            created: '',
            category: Category.Idea,
            status: NoteStatus.Active,
            content: '',
            dates: ''
        };

        dispatch(addNote(emptyNote));
    };

    const onChangeNote = (note: Note) => {
        console.log(note);
        dispatch(changeNote(note));
    };

    const onDeleteNote = (note: Note) => {
        dispatch(deleteNote(note));
    };

    const renderNotes = (arr: Note[]) =>
        arr.map((elem: Note) => {
            const id = getRandomDigit();
            return (
                <NoteView
                    key={id}
                    entity={elem}
                    onChangeNote={onChangeNote}
                    onDeleteNote={onDeleteNote}
                />
            );
        });

    return (
        <div className="notes-container">
            <Counter notesState={state} />
            <TableCaption />
            {activeNotes ? renderNotes(activeNotes) : <p>There are not active notes</p>}
            <div className="control-buttons">
                <Button className="view-archived-btn" color="primary" id="toggler">
                    Archived notes
                </Button>
                <Button id="add-note-btn" color="primary" onClick={onAddNote}>
                    New note
                </Button>
            </div>
            <div className="collapsed-content">
                <UncontrolledCollapse toggler="#toggler">
                    {archivedNotes && archivedNotes.length > 0 ? (
                        renderNotes(archivedNotes)
                    ) : (
                        <p>Opps you don&apos;t have archived notes</p>
                    )}
                </UncontrolledCollapse>
            </div>
        </div>
    );
};

export default NotesPage;
