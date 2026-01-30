import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, Edit, Trash2, Search, Eye, Loader2, Sparkles, CheckCircle2, X, PlusCircle,
  FileText, MessageSquare, Tag, LayoutDashboard, Volume2, Image, BookOpen, Mic,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import AdminLayout from "../../../../components/Admin/AdminLayout"; // Adjust path as needed

const ManageSpeaking = () => {
  const { user } = useSelector((state) => state.auth);
  const [speakingSections, setSpeakingSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState({});
  const [unusedLoading, setUnusedLoading] = useState(true);

  // State for form fields including question arrays
  const initialForm = {
    title: "",
    readAloudQuestions: [],
    repeatSentenceQuestions: [],
    describeImageQuestions: [],
    reTellLectureQuestions: [],
    summarizeSpokenTextQuestions: [],
    highlightIncorrectWordsQuestions: [],
  };
  const [form, setForm] = useState(initialForm);

  const fetchSpeakingSections = async () => {
    setLoading(true);
    try {
      // It's crucial that this endpoint either populates the questions
      // or we fetch full details when opening the edit modal.
      // Assuming /api/question/speaking returns sections with populated questions
      // or at least enough info (like title) to display.
      const res = await axios.get("/api/question/speaking");
      setSpeakingSections(res.data.data || []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnusedQuestions = async () => {
    setUnusedLoading(true);
    try {
      const res = await axios.get("/api/question/speaking/get/unused");
      setAvailableQuestions(res.data.data || {});
    } catch (err) {
      console.error("Failed to fetch unused questions:", err);
    } finally {
      setUnusedLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakingSections();
    // No need to fetch unused questions on initial load if we always fetch them
    // when opening the modal. This avoids potentially stale data.
  }, []);

  const filteredSpeakingSections = useMemo(() => {
    return speakingSections.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [speakingSections, searchTerm]);

  // Helper to normalize question type names for `availableQuestions` keys
  const getAvailableQuestionsKey = (formQuestionType) => {
    // e.g., "readAloudQuestions" -> "readAloud"
    return formQuestionType.replace('Questions', '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      // Ensure all question arrays only contain IDs for the payload
      const payload = {
        title: form.title,
        readAloudQuestions: form.readAloudQuestions.map(q => q._id || q),
        repeatSentenceQuestions: form.repeatSentenceQuestions.map(q => q._id || q),
        describeImageQuestions: form.describeImageQuestions.map(q => q._id || q),
        reTellLectureQuestions: form.reTellLectureQuestions.map(q => q._id || q),
        summarizeSpokenTextQuestions: form.summarizeSpokenTextQuestions.map(q => q._id || q),
        highlightIncorrectWordsQuestions: form.highlightIncorrectWordsQuestions.map(q => q._id || q),
      };

      if (editingId) {
        await axios.put(`/api/question/speaking/${editingId}`, payload);
      } else {
        await axios.post("/api/question/speaking", payload); // Assuming this is your create endpoint
      }
      setIsModalOpen(false);
      await fetchSpeakingSections(); // Re-fetch sections to update list
      // No need to fetch unused questions here explicitly, as modal close handles it implicitly for next open
    } catch (err) {
      console.error("Error saving speaking section:", err);
      // TODO: Add more robust error handling and user feedback
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddQuestionToForm = (questionType, question) => {
    setForm(prevForm => ({
      ...prevForm,
      [questionType]: [...prevForm[questionType], question]
    }));

    // Remove from available questions
    const key = getAvailableQuestionsKey(questionType);
    setAvailableQuestions(prevAvailable => ({
      ...prevAvailable,
      [key]: prevAvailable[key].filter(q => q._id !== question._id)
    }));
  };

  const handleRemoveQuestionFromForm = (questionType, questionId) => {
    const removedQuestion = form[questionType].find(q => (q._id || q) === questionId);

    setForm(prevForm => ({
      ...prevForm,
      [questionType]: prevForm[questionType].filter(q => (q._id || q) !== questionId)
    }));

    // Add back to available questions IF it was found
    if (removedQuestion) {
      const key = getAvailableQuestionsKey(questionType);
      setAvailableQuestions(prevAvailable => ({
        ...prevAvailable,
        [key]: [...(prevAvailable[key] || []), removedQuestion]
      }));
    }
  };


  const handleEditClick = async (section) => {
    setEditingId(section._id);
    setIsModalOpen(true); // Open modal immediately

    setSubmitLoading(true); // Indicate loading for form data
    try {
      // Fetch the full section details with populated questions
      const res = await axios.get(`/api/question/speaking/${section._id}`); // Assuming a GET by ID endpoint that populates questions
      const detailedSection = res.data.data;

      setForm({
        title: detailedSection.title,
        readAloudQuestions: detailedSection.readAloudQuestions || [],
        repeatSentenceQuestions: detailedSection.repeatSentenceQuestions || [],
        describeImageQuestions: detailedSection.describeImageQuestions || [],
        reTellLectureQuestions: detailedSection.reTellLectureQuestions || [],
        summarizeSpokenTextQuestions: detailedSection.summarizeSpokenTextQuestions || [],
        highlightIncorrectWordsQuestions: detailedSection.highlightIncorrectWordsQuestions || [],
      });

      // Fetch all unused questions
      const unusedRes = await axios.get("/api/question/speaking/get/unused");
      const fetchedUnusedQuestions = unusedRes.data.data || {};

      // Filter out questions already in the current section from the fetched unused list
      const filteredAvailableQuestions = {};
      for (const typeKey in fetchedUnusedQuestions) {
          const formKey = `${typeKey}Questions`; // Convert back to form key like "readAloudQuestions"
          const sectionQuestionIds = new Set(detailedSection[formKey]?.map(q => q._id.toString()));
          filteredAvailableQuestions[typeKey] = fetchedUnusedQuestions[typeKey].filter(
              q => !sectionQuestionIds.has(q._id.toString())
          );
      }
      setAvailableQuestions(filteredAvailableQuestions);

    } catch (err) {
      console.error("Failed to fetch speaking section details for editing:", err);
      // TODO: Show error message
      setIsModalOpen(false); // Close modal if fetching fails
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Speaking section? This cannot be undone.")) {
      try {
        await axios.delete(`/api/question/speaking/${id}`);
        fetchSpeakingSections(); // Re-fetch sections to update list
        // No need to fetch unused questions here explicitly, as modal open/save handles it implicitly for next open
      } catch (err) {
        console.error("Error deleting speaking section:", err);
        // TODO: Show error message
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm); // Reset form state
    setAvailableQuestions({}); // Clear available questions to ensure fresh fetch next time
  };


  const renderQuestionSelection = (questionType, questionsArray, Icon) => {
    const availableKey = getAvailableQuestionsKey(questionType);
    const questionsToDisplay = availableQuestions[availableKey] || [];

    return (
      <div className="space-y-4 border p-4 rounded-xl bg-slate-50">
        <h3 className="flex items-center gap-2 font-bold text-slate-700">
          <Icon size={20} className="text-indigo-500" />
          {questionType.replace(/([A-Z])/g, ' $1').trim().replace('Questions', ' Questions')}
          <span className="text-sm text-slate-500 font-normal">({form[questionType].length} selected)</span>
        </h3>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] border-b pb-2">
          {form[questionType].length === 0 ? (
             <span className="text-sm text-slate-400 italic">No questions selected.</span>
          ) : (
            form[questionType].map((q) => (
              <span key={q._id || q} className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                {q.title || q.text || `ID: ${q._id || q}`}
                <button type="button" onClick={() => handleRemoveQuestionFromForm(questionType, q._id || q)} className="ml-1 text-indigo-500 hover:text-indigo-800"><X size={14} /></button>
              </span>
            ))
          )}
        </div>
        {unusedLoading ? (
          <Loader2 className="animate-spin mx-auto text-indigo-400" size={24} />
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-white">
            {questionsToDisplay.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-2">No more available questions of this type.</p>
            ) : (
              questionsToDisplay.map((q) => (
                <button
                  type="button"
                  key={q._id}
                  onClick={() => handleAddQuestionToForm(questionType, q)}
                  className="w-full text-left p-2 border rounded-lg hover:bg-indigo-50 transition-colors text-sm text-slate-700"
                >
                  {q.title || q.text || q.question || `Question ID: ${q._id}`}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manage Speaking Sections</h2>
            <p className="text-slate-500 font-medium">Create and organize PTE Speaking test sections</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
              fetchUnusedQuestions(); // Load unused questions for new form
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100"
          >
            <PlusCircle size={22} /> <span>Create New Speaking Section</span>
          </motion.button>
        </div>

        {/* SEARCH */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={20} />
          <input
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by section title..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
          />
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={40} /></div>
          ) : filteredSpeakingSections.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No Speaking sections found.</div>
          ) : (
            filteredSpeakingSections.map((section) => (
              <motion.div key={section._id} whileHover={{ y: -4 }} className="grid grid-cols-1 md:grid-cols-12 items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="col-span-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Mic size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{section.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Speaking Module</p>
                  </div>
                </div>
                <div className="col-span-3 text-center text-slate-600 text-sm">
                  {/* Display question counts for each type */}
                  <p>RA: {section.readAloudQuestions?.length || 0} | RS: {section.repeatSentenceQuestions?.length || 0}</p>
                  <p>DI: {section.describeImageQuestions?.length || 0} | RL: {section.reTellLectureQuestions?.length || 0}</p>
                  <p>SST: {section.summarizeSpokenTextQuestions?.length || 0} | HIW: {section.highlightIncorrectWordsQuestions?.length || 0}</p>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button onClick={() => { setViewData(section); setIsViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Eye size={18} /></button>
                  <button onClick={() => handleEditClick(section)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(section._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* ADD/EDIT MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-2xl font-black text-slate-800">{editingId ? "Edit Speaking Section" : "New Speaking Section"}</h2>
                  <button onClick={handleCloseModal} className="p-2 hover:bg-white rounded-xl shadow-sm"><X size={20} /></button>
                </div>
                <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                  <input
                    placeholder="Section Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white"
                    required
                  />

                  {submitLoading ? ( // Show loader while fetching edit data
                     <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={32}/></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderQuestionSelection("readAloudQuestions", availableQuestions.readAloud || [], Volume2)}
                      {renderQuestionSelection("repeatSentenceQuestions", availableQuestions.repeatSentence || [], Headphones)}
                      {renderQuestionSelection("describeImageQuestions", availableQuestions.describeImage || [], Image)}
                      {renderQuestionSelection("reTellLectureQuestions", availableQuestions.reTellLecture || [], BookOpen)}
                      {renderQuestionSelection("summarizeSpokenTextQuestions", availableQuestions.summarizeSpokenText || [], FileText)}
                      {renderQuestionSelection("highlightIncorrectWordsQuestions", availableQuestions.highlightIncorrectWords || [], Sparkles)}
                    </div>
                  )}


                  <button disabled={submitLoading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl">
                    {submitLoading ? <Loader2 className="animate-spin mx-auto" /> : "Save Speaking Section"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* VIEW MODAL */}
        <AnimatePresence>
          {isViewModalOpen && viewData && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Speaking Section</span>
                      <h2 className="text-3xl font-black text-slate-900">{viewData.title}</h2>
                    </div>
                    <button onClick={() => setIsViewModalOpen(false)} className="p-3 bg-slate-100 rounded-full"><X /></button>
                  </div>

                  {/* Display details of questions within this section */}
                  {[
                    { type: "readAloudQuestions", label: "Read Aloud", icon: Volume2 },
                    { type: "repeatSentenceQuestions", label: "Repeat Sentence", icon: Headphones },
                    { type: "describeImageQuestions", label: "Describe Image", icon: Image },
                    { type: "reTellLectureQuestions", label: "Re-tell Lecture", icon: BookOpen },
                    { type: "summarizeSpokenTextQuestions", label: "Summarize Spoken Text", icon: FileText },
                    { type: "highlightIncorrectWordsQuestions", label: "Highlight Incorrect Words", icon: Sparkles },
                  ].map(({ type, label, icon: Icon }, index) => (
                    viewData[type] && viewData[type].length > 0 && (
                      <div key={index} className="space-y-4">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 border-b pb-2">
                          <Icon className="text-indigo-500" size={24} /> {label} ({viewData[type].length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {viewData[type].map(q => ( 
                            <div key={q} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                              <p className="font-semibold text-slate-700">{q.title || q.text || q.question || `Question ID: ${q}`}</p>
                              {/* Add more specific details if needed, e.g., audio player for Read Aloud */}
                              {/* {type === "readAloudQuestions" && q.audioUrl && (
                                <audio controls src={q.audioUrl} className="w-full mt-2" />
                              )}
                              {type === "describeImageQuestions" && q.imageUrl && (
                                <img src={q.imageUrl} alt="Description" className="w-full h-32 object-cover rounded-lg mt-2" />
                              )} */}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default ManageSpeaking;