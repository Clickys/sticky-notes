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
    trash: [],

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
    addNoteToTrash( note ) {
        const appNote = this.noteList[ note.id ];
        const domNote = note;

        DOM.addTrashNoteDOM( appNote, domNote );
    },
};

//* TODO: CREATE DOM OBJECT
//* TODO: 1. CREATE DOM STRINGS
//* TODO: 2.CREATE A METHOD TO ADD A TODO TO THE DOM

const DOM = {
    DOMStrings: {
        noteInput: '.note-app-input',
        noteWrapper: '.note-wrapper',
        emptyDefaultCells: '.empty-cells-default',
        notes: '.notes',
        closeIcon: 'fas fa-times-circle fa-2x close-icon',
        compeletedIcon: 'fas fa-check fa-2x complete-icon',
        importantIcon: 'fas fa-exclamation fa-2x important-icon',
        reminderIcon: 'fas fa-bell fa-2x reminder-icon',
        editModal: '#edit-modal',
        noteFooter: '.note-footer',
        emptyCells: '.empty-cells',
        container: '.container',
        editNoteInput: '.edit-note-input',
        noteContent: '.note-content',
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
        handlers.editNoteEvent();
        this.displayNoteTime();
        handlers.dragNDrop();
    },
    reAssignDOMIds() {
        const notes = Array.from( document.querySelectorAll( this.DOMStrings.notes ) );
        notes.forEach( ( note, index ) => {
            note.id = index;
        } );
    },

    removeDOMNote( e ) {
        // NOTE PARENT AND WRAPPER
        const noteContainer = e.target.parentElement.parentElement;
        const noteWrapper = e.target.parentElement.parentElement.parentElement;
        // CLOSE ICON
        if ( e.target.className === this.DOMStrings.closeIcon ) {
            // Remove note from the app
            noteApp.removeNote( Number( noteContainer.id ) );
            // Remove note from dom
            noteWrapper.removeChild( noteContainer );
            // Reassign DOM IDs
            this.reAssignDOMIds();
        }
    },
    isCompletedDOMNote( e ) {
        if ( e.target.className.includes( this.DOMStrings.compeletedIcon ) ) {
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
        if ( e.target.className.includes( this.DOMStrings.importantIcon ) ) {
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
    editNote( e ) {
        if ( e.target.tagName === 'P' ) {
            const note = e.target.parentElement.parentElement;
            const noteID = Number( e.target.parentElement.parentElement.id );
            const p = e.target;
            const pOldText = e.target.textContent;
            const textArea = document.createElement( 'textarea' );

            // Customize textArea
            textArea.setAttribute( 'cols', '18' );
            textArea.setAttribute( 'rows', '3' );

            textArea.textContent = pOldText;
            p.textContent = '';
            p.append( textArea );

            // Add event listener for every textarea is created by edit note .
            textArea.addEventListener( 'keypress', ( e ) => {
                if ( e.keyCode === 13 ) {
                    noteApp.noteList[ noteID ].noteText = textArea.value;
                    p.textContent = textArea.value;
                }
            } );
        }
    },
    addTrashNoteDOM( appNote, domNote ) {
        const emptyTrashCells = document.querySelectorAll( '.empty-trash-cells' );
        let emptyCell;

        emptyTrashCells.forEach( ( cell ) => {
            if ( cell.innerHTML === '' ) {
                emptyCell = cell;
            }
        } );

        noteApp.trash.push( appNote );
        emptyCell.append( domNote );
    },

    trashNotee( note, e ) {
        console.log( note.parentElement );
        const noteParent = note.parentElement; // Note parent .empty-cell
        const noteID = Number( note.id );

        noteApp.addNoteToTrash( note );

        noteApp.removeNote( noteID );
    },

    displayNoteTime() {
        document.querySelector( this.DOMStrings.noteFooter ).textContent = moment().format(
            'MMMM Do, h:mm:ss',
        );
    },
};

const dragNDrop = {
    dragOver( e ) {
        e.preventDefault();
    },

    dragEnter( e ) {
        e.preventDefault();
        if ( e.target.className === 'empty-trash-cells' ) {
            this.classList.add( 'hover-white' );
        }
        this.classList.add( 'hovered' );
    },

    dragLeave( e ) {
        this.classList.remove( 'hovered' );
        this.classList.remove( 'hover-white' );
    },

    dragDrop( e ) {
        const ID = handlers.activeNote.id;
        const note = document.getElementById( ID );

        if ( this.className === 'trash-icon' ) {
            DOM.trashNotee( note, e );
        } else {
            this.append( note );
            this.classList.remove( 'hovered' );
            this.classList.remove( 'hover-white' );
        }
    },
    dragStart( e ) {
        handlers.activeNote = e.target;
        handlers.activeNoteID = Number( e.target.id );

        this.classList.add( 'hold' );
    },

    dragEnd( e ) {
        this.classList.remove( 'hold' );
    },
};

const handlers = {
    activeNote: '',
    ativeNoteID: -1,
    getAllEvents() {
        const emptyCells = Array.from( document.querySelectorAll( DOM.DOMStrings.emptyCells ) );
        const emptyDefaultCells = Array.from(
            document.querySelectorAll( DOM.DOMStrings.emptyDefaultCells ),
        );
        const emptyTrashCells = Array.from( document.querySelectorAll( '.empty-trash-cells' ) );

        const recycleBin = document.querySelector( '.trash-icon' );

        const noteInput = document.querySelector( '.note-app-input' );

        // EVENTLISTENERS WAITING FOR NOTE ICONS TO BE CLICKED
        document.addEventListener( 'click', ( e ) => {
            const modal = document.querySelector( '#trash-modal' );

            if ( e.target.className === 'modal-content' ) {
                modal.classList.toggle( 'modal-show' );
            }
            DOM.removeDOMNote( e );
            DOM.isCompletedDOMNote( e );
            DOM.isImportantDOMNote( e );
        } );

        // EVENTLISTENR WAITING FOR ENTER
        noteInput.addEventListener( 'keypress', ( e ) => {
            if ( e.keyCode === 13 ) {
                if ( e.target.value !== '' ) {
                    DOM.displayNotes();
                }
            }
        } );

        // EVENTLISTENER FOR MODALS

        recycleBin.addEventListener( 'dblclick', () => {
            const trashModal = document.querySelector( '#trash-modal' );
            trashModal.classList.toggle( 'modal-show' );
        } );
        // Drag and drop grid
        emptyCells.forEach( ( cell ) => {
            cell.addEventListener( 'dragover', dragNDrop.dragOver );
            cell.addEventListener( 'dragenter', dragNDrop.dragEnter );
            cell.addEventListener( 'dragleave', dragNDrop.dragLeave );
            cell.addEventListener( 'drop', dragNDrop.dragDrop );
        } );

        emptyDefaultCells.forEach( ( cell ) => {
            cell.addEventListener( 'dragover', dragNDrop.dragOver );
            cell.addEventListener( 'dragenter', dragNDrop.dragEnter );
            cell.addEventListener( 'dragleave', dragNDrop.dragLeave );
            cell.addEventListener( 'drop', dragNDrop.dragDrop );
        } );

        emptyTrashCells.forEach( ( cell ) => {
            cell.addEventListener( 'dragover', dragNDrop.dragOver );
            cell.addEventListener( 'dragenter', dragNDrop.dragEnter );
            cell.addEventListener( 'dragleave', dragNDrop.dragLeave );
            cell.addEventListener( 'drop', dragNDrop.dragDrop );
        } );

        recycleBin.addEventListener( 'dragover', dragNDrop.dragOver );
        recycleBin.addEventListener( 'drop', dragNDrop.dragDrop );
    },
    dragNDrop() {
        const notes = Array.from( document.querySelectorAll( DOM.DOMStrings.notes ) );

        notes.forEach( ( note ) => {
            note.addEventListener( 'dragstart', dragNDrop.dragStart );
            note.addEventListener( 'dragend', dragNDrop.dragEnd );
            note.setAttribute( 'draggable', true );
        } );
    },
    editNoteEvent() {
        document
            .querySelector( DOM.DOMStrings.noteContent )
            .addEventListener( 'dblclick', DOM.editNote );
    },
};

function init() {
    handlers.getAllEvents();
}

init();
