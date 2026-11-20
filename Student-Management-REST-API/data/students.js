const mongoose = require('mongoose');

const studentDefinition = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

const sequenceDefinition = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }
}, { versionKey: false });

const StudentRecord = mongoose.models.Student || mongoose.model('Student', studentDefinition);
const IdSequence = mongoose.models.Counter || mongoose.model('Counter', sequenceDefinition);

const STUDENT_SEQUENCE_KEY = 'studentId';
const STARTER_RECORDS = [
  { id: 1, name: 'Manas', course: 'BCA' },
  { id: 2, name: 'Naman', course: 'BTech' },
  { id: 3, name: 'Prithvee', course: 'BCA' }
];

const findLatestStudentRecord = () =>
  StudentRecord.findOne().sort({ id: -1 }).select('id');

const alignStudentSequence = async () => {
  const latestRecord = await findLatestStudentRecord();
  if (!latestRecord) return;

  await IdSequence.findByIdAndUpdate(
    STUDENT_SEQUENCE_KEY,
    { $max: { sequenceValue: latestRecord.id } },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

const prepareStudentData = async () => {
  const hasRecords = await StudentRecord.exists({});
  if (!hasRecords) {
    await StudentRecord.insertMany(STARTER_RECORDS);
  }

  await alignStudentSequence();
};

const allocateStudentId = async () => {
  const sequence = await IdSequence.findByIdAndUpdate(
    STUDENT_SEQUENCE_KEY,
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return sequence.sequenceValue;
};

const listStudents = async () => StudentRecord.find().sort({ id: 1 });

const findStudent = async (id) => StudentRecord.findOne({ id });

const createStudent = async ({ name, course }) => {
  const id = await allocateStudentId();
  return StudentRecord.create({ id, name, course });
};

const reviseStudent = async (id, { name, course }) =>
  StudentRecord.findOneAndUpdate(
    { id },
    { $set: { name, course } },
    { new: true, runValidators: true }
  );

const removeStudent = async (id) => StudentRecord.findOneAndDelete({ id });

module.exports = {
  prepareStudentData,
  listStudents,
  findStudent,
  createStudent,
  reviseStudent,
  removeStudent
};
