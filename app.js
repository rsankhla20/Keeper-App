const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//mongoose.connect("mongodb://127.0.0.1:27017/keeperDB");
mongoose.connect(process.env.MONGODB_URL);
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model("note", noteSchema);

app.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

//to get new content and update in database
app.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({ title, content });
    await newNote.save();
    const updatedNotes = await Note.find();
    res.send(updatedNotes);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteId;

  try {
    await Note.findByIdAndRemove(deleteId);
    console.log("Item removed successfully");
    const updatedNotes = await Note.find();
    res.send(updatedNotes);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen("4000", () => {
  console.log("server started successfully on port 4000");
});
//Gmrh2zRHHmhMjuwq
