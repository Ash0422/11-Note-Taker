// Select the note title and text inputs
const $titleInput = $(".note-title");
const $textInput = $(".note-textarea");
// Select the save and create note buttons
const $saveBtn = $(".save-note");
const $createBtn = $(".new-note");
// Select the note container for displaying the list of notes
const $noteContainer = $(".list-container .list-group");

// An object to store the currently active note
let activeNote = {};

// Get the list of notes from the server
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// Save a note to the server
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// Delete a note from the server
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// Display the currently active note in the input fields
const displayCurrentNote = () => {
  // Hide the save button
  $saveBtn.hide();

  if (activeNote.id) {
    $titleInput.attr("readonly", true);
    $textInput.attr("readonly", true);
    $titleInput.val(activeNote.title);
    $textInput.val(activeNote.text);
  } else {
    $titleInput.attr("readonly", false);
    $textInput.attr("readonly", false);
    $titleInput.val("");
    $textInput.val("");
  }
};

// Process the saving of a new note
const processNoteSaving = function () {
  let newID = Math.floor(Math.random() * 1000000000);

  // Create an object for the new note with the generated ID and input values
  const newNote = {
    id: newID,
    title: $titleInput.val(),
    text: $textInput.val(),
  };
  // Save the new note and retrieve and display the updated note list
  saveNote(newNote).then(() => {
    retrieveDisplayNote();
    displayCurrentNote();
  });
};
// Function to handle the removal of a note
const processNoteRemoval = function (event) {
  event.stopPropagation();
// Get the data of the note that was clicked
  const note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    retrieveDisplayNote();
    displayCurrentNote();
  });
};

const showSelectedNote = function () {
  activeNote = $(this).data();
  displayCurrentNote();
};

const displayNewNote = function () {
  activeNote = {};
  displayCurrentNote();
};

const displaySaveButton = function () {
  if (!$titleInput.val().trim() || !$textInput.val().trim()) {
    $saveBtn.hide();
  } else {
    $saveBtn.show();
  }
};

const displayNoteList = (notes) => {
  $noteContainer.empty();

  const noteContainerItems = [];

  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
  };

  if (notes.length === 0) {
    noteContainerItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteContainerItems.push($li);
  });

  $noteContainer.append(noteContainerItems);
};

const retrieveDisplayNote = () => {
  return getNotes().then(displayNoteList);
};

$saveBtn.on("click", processNoteSaving);
$noteContainer.on("click", ".list-group-item", showSelectedNote);
$createBtn.on("click", displayNewNote);
$noteContainer.on("click", ".delete-note", processNoteRemoval);
$titleInput.on("keyup", displaySaveButton);
$textInput.on("keyup", displaySaveButton);

retrieveDisplayNote();
