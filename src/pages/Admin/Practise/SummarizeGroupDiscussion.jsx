import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { useSelector } from "react-redux";

const initialForm = {
  title: "",
  prepareTime: 30,
  answerTime: 60,
  difficulty: "Medium",
  answer: "",
  audio: null,
};

const ManageSummarizeGroup = () => {
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
      const res = await axios.get(`/api/summarize-group/get/${user._id}`);
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

  /* ---------------- FORM HANDLERS ---------------- */
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
      prepareTime: q.prepareTime,
      answerTime: q.answerTime,
      difficulty: q.difficulty,
      answer: q.answer,
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
    fd.append("prepareTime", form.prepareTime);
    fd.append("answerTime", form.answerTime);
    fd.append("difficulty", form.difficulty);
    fd.append("answer", form.answer);
    if (form.audio) fd.append("audio", form.audio);

    try {
      if (editingId) {
        await axios.put(`/api/admin/summarize-group/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/admin/summarize-group", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setOpenModal(false);
      fetchQuestions();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`/api/admin/summarize-group/${id}`);
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
            Manage Summarize Group Discussion
          </h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
                <th className="p-3 text-center">Prepare</th>
                <th className="p-3 text-center">Answer</th>
                <th className="p-3 text-center">Difficulty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-3 font-medium">{q.title}</td>
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
                  <td colSpan="5" className="p-6 text-center text-slate-400">
                    No questions found
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
                {editingId ? "Edit Question" : "Add Question"}
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
                    placeholder="Enter question title"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Answer
                  </label>
                  <textarea
                    name="answer"
                    value={form.answer}
                    onChange={handleChange}
                    placeholder="Enter expected answer"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Prepare Time (seconds)
                    </label>
                    <input
                      type="number"
                      name="prepareTime"
                      min="1"
                      value={form.prepareTime}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Answer Time (seconds)
                    </label>
                    <input
                      type="number"
                      name="answerTime"
                      min="1"
                      value={form.answerTime}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Difficulty Level
                  </label>
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
                </div>

                {/* Audio */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload Audio
                  </label>
                  <div className="flex items-center gap-3">
                    <Upload className="text-blue-600" size={18} />
                    <input
                      type="file"
                      name="audio"
                      accept="audio/*"
                      onChange={handleChange}
                      required={!editingId}
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    MP3 / WAV recommended. Required for new questions.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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

export default ManageSummarizeGroup;
