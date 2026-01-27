import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { useSelector } from "react-redux";

const initialForm = {
  title: "",
  answer: "",
  prepareTime: 3,
  answerTime: 10,
  difficulty: "Easy",
  audio: null,
};

const ManageShortAnswer = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  /* ---------------- FETCH QUESTIONS ---------------- */
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/short-answer/get/${user._id}`
      );
      setQuestions(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /* ---------------- FORM HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const openAddModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setOpenModal(true);
  };

  const openEditModal = (q) => {
    setForm({
      title: q.title,
      answer: q.answer,
      prepareTime: q.prepareTime,
      answerTime: q.answerTime,
      difficulty: q.difficulty,
      audio: null,
    });
    setEditingId(q._id);
    setOpenModal(true);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("answer", form.answer);
    fd.append("prepareTime", form.prepareTime);
    fd.append("answerTime", form.answerTime);
    fd.append("difficulty", form.difficulty);
    if (form.audio) fd.append("audio", form.audio);

    try {
      if (editingId) {
        await axios.put(`/api/short-answer/${editingId}`, fd);
      } else {
        await axios.post(`/api/short-answer/add`, fd);
      }
      setOpenModal(false);
      fetchQuestions();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`/api/short-answer/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-800">
            Manage Answer Short Question
          </h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Answer</th>
                <th className="p-3 text-center">Prepare</th>
                <th className="p-3 text-center">Answer</th>
                <th className="p-3 text-center">Difficulty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{q.title}</td>
                  <td className="p-3 text-slate-600">{q.answer}</td>
                  <td className="p-3 text-center">{q.prepareTime}s</td>
                  <td className="p-3 text-center">{q.answerTime}s</td>
                  <td className="p-3 text-center">{q.difficulty}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(q)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && questions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    No short answer questions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 relative">
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold text-blue-700 mb-6">
                {editingId ? "Edit Short Answer" : "Add Short Answer"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correct Answer
                  </label>
                  <input
                    name="answer"
                    value={form.answer}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="prepareTime"
                    value={form.prepareTime}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                    placeholder="Prepare Time"
                  />
                  <input
                    type="number"
                    name="answerTime"
                    value={form.answerTime}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                    placeholder="Answer Time"
                  />
                </div>

                {/* Difficulty */}
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>

                {/* Audio */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload Question Audio
                  </label>
                  <div className="flex items-center gap-3">
                    <Upload size={18} className="text-blue-600" />
                    <input
                      type="file"
                      name="audio"
                      accept="audio/*"
                      onChange={handleChange}
                      required={!editingId}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update Question" : "Create Question"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageShortAnswer;
