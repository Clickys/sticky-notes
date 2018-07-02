// TODO: 1.  Controller noteApp  / Controller DOM / Controller Main / INIT with { event listners}
// ! NOTEAPP
//* TODO: 1.  Create classes for constructing notes . Should be included
//* noteText, noteId, noteDate, isCompleted , isImportantColor
//* TODO: 2. Store the new note to a new Array as Object
//* TODO: 3. Create Method to add new Notes
//* TODO: 4. Create Method to edit Notes
//* TODO: 5. Create method to remove Notes
//* TODO: 6. Create method to toggle complete Note
//* TODO: 7. Create method to toggle important Note
//* TODO: 8. Create method to display notes
// {
//  noteText: text,
//  noteID:
//  isCompelted: false
//  isImportant: false
// }

// Note Contructor

class Note {
    constructor( noteText, isCompleted, isImportant ) {
        this.noteText = noteText;
        this.isCompleted = isCompleted;
        this.isImportant = isImportant;
    }
}

const noteApp = {
    noteList: [],

    addNewNote( noteText, isImportant = false ) {
        const isCompleted = false;

        // Create new note
        const newNote = new Note( noteText, isCompleted, isImportant );

        // Push the note to noteList
        this.noteList.push( newNote );

        // Loop through noteList and add property id = index
        this.noteList.forEach( ( note, index ) => {
            const noteIndex = index;
            note.id = noteIndex;
        } );

        // DOM Method to display notes to browser
        this.displayNotes();
    },

    displayNotes() {
        this.noteList.forEach( ( note ) => {
            console.log(
                `Note text:  ${ note.noteText } 
                    Note ID:  ${ note.id } 
                    isImportant: ${ note.isImportant } 
                    isCompleted: ${ note.isCompleted }`,
            );
        } );
    },
    editNote( position, newText ) {
        this.noteList[ position ].noteText = newText;
        this.displayNotes();
    },
    removeNote( position ) {
        this.noteList.splice( position, 1 );
        this.displayNotes();
    },

    toggleComplete( position ) {
        this.noteList[ position ].isCompleted = !this.noteList[ position ].isCompleted;
        this.displayNotes();
    },
    toggleIsImportant( position ) {
        this.noteList[ position ].isImportant = !this.noteList[ position ].isImportant;
        this.displayNotes();
    },
};

// TODO: CREATE DOM OBJECT
// TODO: 1. CREATE DOM STRINGS
// TODO: 2.CREATE A METHOD TO ADD A TODO TO THE DOM
const DOM = {
    DOMStrings: {
        noteInput: '.note-app-input',
        noteWrapper: '.note-wrapper',
        emptyDefaultCells: '.empty-cells-default',
    },
    editNoteId: -1,
    displayNotes() {
        const noteInput = document.querySelector( this.DOMStrings.noteInput );
        const emptyCells = Array.from( document.querySelectorAll( this.DOMStrings.emptyDefaultCells ) );

        let htmlNew;
        let html;
        let emptyCell;

        emptyCells.forEach( ( cell ) => {
            if ( cell.innerHTML === '' ) {
                emptyCell = cell;
            }
        } );
        if ( noteInput.value !== '' ) {
            html = '<div class="notes" id="%id%" draggable="true">';
            html += '<div class="note-toolbar">';
            html += '<i class="fas fa-exclamation fa-2x important-icon"></i>';
            html += '<i class="fas fa-bell fa-2x reminder-icon"></i>';
            html += '<i class="fas fa-check fa-2x complete-icon"></i>';
            html += '<i class="fas fa-times-circle fa-2x close-icon"></i>';
            html += '</div>';
            html += '<div class="note-content">';
            html += '<p>%text%</p>';
            html += '</div>';
            html += '<div class="note-footer">';
            html += '</div>';
            html += '</div>';
        }

        // Create new note add it to noteapp
        noteApp.addNewNote( noteInput.value );

        // Loop throught noteList and replace note default %id% and %text%
        // with the notes.id and noteText properties value
        noteApp.noteList.forEach( ( note ) => {
            htmlNew = html.replace( /%id%/g, note.id );
            htmlNew = htmlNew.replace( /%text%/g, note.noteText );
        } );

        emptyCell.innerHTML += htmlNew;

        noteInput.value = '';

        this.displayNoteTime();
        handlers.dragNDrop();
    },
    reAssignDOMIds() {
        const notes = Array.from( document.querySelectorAll( '.notes' ) );
        notes.forEach( ( note, index ) => {
            note.id = index;
        } );
    },

    removeDOMNote( e ) {
        // NOTE PARENT AND WRAPPER
        const noteContainer = e.target.parentElement.parentElement;
        const noteWrapper = e.target.parentElement.parentElement.parentElement;
        // CLOSE ICON
        if ( e.target.className === 'fas fa-times-circle fa-2x close-icon' ) {
            // Remove note from the app
            noteApp.removeNote( Number( noteContainer.id ) );
            // Remove note from dom
            noteWrapper.removeChild( noteContainer );
            // Reassign DOM IDs
            this.reAssignDOMIds();
        }
    },
    isCompletedDOMNote( e ) {
        if ( e.target.className.includes( 'fas fa-check fa-2x complete-icon' ) ) {
            const noteContainer = e.target.parentElement.parentElement;
            const noteToolbar = e.target.parentElement;
            const noteText = e.target.parentElement.nextElementSibling.children[ 0 ];
            const noteIcon = e.target;

            noteApp.toggleComplete( Number( noteContainer.id ) );
            noteToolbar.classList.toggle( 'isCompletedToolbar' );
            noteContainer.classList.toggle( 'isCompletedContent' );
            noteText.classList.toggle( 'isCompletedText' );
            noteIcon.classList.toggle( 'isCompletedIcon' );
        }
    },

    isImportantDOMNote( e ) {
        if ( e.target.className.includes( 'fas fa-exclamation fa-2x important-icon' ) ) {
            const noteContainer = e.target.parentElement.parentElement;
            const noteToolbar = e.target.parentElement;
            const noteText = e.target.parentElement.nextElementSibling.children[ 0 ];
            const noteIcon = e.target;

            noteApp.toggleIsImportant( Number( noteContainer.id ) );
            noteToolbar.classList.toggle( 'isImportantToolbar' );
            noteContainer.classList.toggle( 'isImportantContent' );
            noteText.classList.toggle( 'isImportantText' );
            noteIcon.classList.toggle( 'isImportantIcon' );
        }
    },
    editDOMNote( e ) {
        if ( e.target.className.includes( 'fas fa-bell fa-2x reminder-icon' ) ) {
            this.editNoteId = Number( e.target.parentElement.parentElement.id );
            const editModal = document.querySelector( '#edit-modal' );
            editModal.classList.toggle( 'modal-show' );
        }
    },
    dragOver( e ) {
        e.preventDefault();
    },

    dragEnter( e ) {
        e.preventDefault();
        this.classList.add( 'hovered' );
    },

    dragLeave() {
        this.classList.remove( 'hovered' );
    },

    dragDrop() {
        const ID = handlers.note.id;
        const note = document.getElementById( ID );

        this.append( note );
        this.classList.remove( 'hovered' );
    },
    displayNoteTime() {
        document.querySelector( '.note-footer' ).textContent = moment().format( 'MMMM Do, h:mm:ss' );
    },
};

const handlers = {
    note: '',
    noteID: -1,
    getAllEvents() {
        const emptyCells = Array.from( document.querySelectorAll( '.empty-cells' ) );
        const emptyDefaultCells = Array.from(
            document.querySelectorAll( DOM.DOMStrings.emptyDefaultCells ),
        );
        const container = document.querySelector( '.container' );

        const editModal = document.querySelector( '#edit-modal' );

        editModal.addEventListener( 'keypress', ( e ) => {
            // ! CREATE SEPERATE FUNCTION FOR THIS FEATURE 
            const editInput = document.querySelector( '.edit-note-input' );
            if ( e.keyCode === 13 ) {
                noteApp.editNote( DOM.editNoteId, editInput.value );
                const currentNote = document.getElementById( DOM.editNoteId );
                
                currentNote.children[ 1 ].innerHTML = editInput.value;
                editInput.value = '';
            }
        } );

        // EVENTLISTENERS WAITING FOR NOTE ICONS TO BE CLICKED
        document.addEventListener( 'click', ( e ) => {
            DOM.removeDOMNote( e );
            DOM.isCompletedDOMNote( e );
            DOM.isImportantDOMNote( e );
            DOM.editDOMNote( e );
        } );
        // EVENTLISTENR WAITING FOR ENTER
        container.addEventListener( 'keypress', ( e ) => {
            if ( e.keyCode === 13 ) {
                DOM.displayNotes();
            }
        } );

        // EVENTLISTENER FOR MODALS
        window.addEventListener( 'click', ( e ) => {
            const modal = document.querySelector( '.modal' );
            if ( e.target.className.includes( 'modal' ) ) {
                modal.classList.toggle( 'modal-show' );
            }
        } );
        // Drag and drop grid
        emptyCells.forEach( ( cell ) => {
            cell.addEventListener( 'dragover', DOM.dragOver );
            cell.addEventListener( 'dragenter', DOM.dragEnter );
            cell.addEventListener( 'dragleave', DOM.dragLeave );
            cell.addEventListener( 'drop', DOM.dragDrop );
        } );
        emptyDefaultCells.forEach( ( cell ) => {
            cell.addEventListener( 'dragover', DOM.dragOver );
            cell.addEventListener( 'dragenter', DOM.dragEnter );
            cell.addEventListener( 'dragleave', DOM.dragLeave );
            cell.addEventListener( 'drop', DOM.dragDrop );
        } );
    },
    dragNDrop() {
        const notes = Array.from( document.querySelectorAll( '.notes' ) );

        notes.forEach( ( note ) => {
            note.addEventListener( 'dragstart', dragStart );
            note.addEventListener( 'dragend', dragEnd );
            note.setAttribute( 'draggable', true );
        } );

        function dragStart( e ) {
            handlers.note = e.target;
            handlers.noteID = Number( e.target.id );

            this.classList.add( 'hold' );
        }

        function dragEnd( e ) {
            this.classList.remove( 'hold' );
        }
    },
};

function init() {
    handlers.getAllEvents();
}

init();
