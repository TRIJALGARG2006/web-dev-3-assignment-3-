const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }
}, { versionKey: false });

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const COUNTER_NAME = 'studentId';
const sampleStudents = [
  { id: 1, name: 'Manas', course: 'BCA' },
  { id: 2, name: 'Naman', course: 'BTech' },
  { id: 3, name: 'Prithvee', course: 'BCA' }
];

async function updateCounter() {
  const lastStudent = await Student.findOne().sort({ id: -1 });
  if (!lastStudent) return;

  await Counter.findByIdAndUpdate(
    COUNTER_NAME,
    { $max: { sequenceValue: lastStudent.id } },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

async function seedStudents() {
  const count = await Student.countDocuments();
  if (count === 0) {
    await Student.insertMany(sampleStudents);
  }

  await updateCounter();
}

async function getNewId() {
  const counter = await Counter.findByIdAndUpdate(
    COUNTER_NAME,
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.sequenceValue;
}

async function getAllStudents() {
  return Student.find().sort({ id: 1 });
}

async function getStudentById(id) {
  return Student.findOne({ id });
}

async function addStudent({ name, course }) {
  const id = await getNewId();
  return Student.create({ id, name, course });
}

async function updateStudent(id, { name, course }) {
  return Student.findOneAndUpdate(
    { id },
    { $set: { name, course } },
    { new: true, runValidators: true }
  );
}

async function deleteStudent(id) {
  return Student.findOneAndDelete({ id });
}

module.exports = {
  seedStudents,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
