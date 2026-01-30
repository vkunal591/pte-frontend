import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, Edit, Trash2, Search, Eye, Loader2, X, PlusCircle,
  Headphones, FileText, ListChecks, GalleryVertical, SquareDashedMousePointer,
  CircleDot, Highlighter, BookAudio, Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import AdminLayout from "../../../../components/Admin/AdminLayout"; // Adjust path as needed

const ManageListening = () => {
  const { user } = useSelector((state) => state.auth);
  const [listeningSections, setListeningSections] = useState([]);
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
    summarizeSpokenTextQuestions: [],
    multipleChoiceMultiple: [],
    fillInTheBlanks: [],
    highlightIncorrectSummary: [],
    multipleChoiceSingle: [],
    selectMissingWord: [],
    highLightIncorrectWords: [],
    writeFromDictation: [],
  };
  const [form, setForm] = useState(initialForm);

  const fetchListeningSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/question/listening"); // Assuming this endpoint gets all listening sections
      setListeningSections(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnusedQuestions = async () => {
    setUnusedLoading(true);
    try {
      const res = await axios.get("/api/question/listening/get/unused"); // This endpoint fetches all unused questions
      setAvailableQuestions(res.data.data || {});
    } catch (err) {
      console.error("Failed to fetch unused questions:", err);
    } finally {
      setUnusedLoading(false);
    }
  };

  useEffect(() => {
    fetchListeningSections();
    fetchUnusedQuestions();
  }, []);

  const filteredListeningSections = useMemo(() => {
    return listeningSections.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [listeningSections, searchTerm]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        title: form.title,
        summarizeSpokenTextQuestions: form.summarizeSpokenTextQuestions.map(q => q._id || q),
        multipleChoiceMultiple: form.multipleChoiceMultiple.map(q => q._id || q),
        fillInTheBlanks: form.fillInTheBlanks.map(q => q._id || q),
        highlightIncorrectSummary: form.highlightIncorrectSummary.map(q => q._id || q),
        multipleChoiceSingle: form.multipleChoiceSingle.map(q => q._id || q),
        selectMissingWord: form.selectMissingWord.map(q => q._id || q),
        highLightIncorrectWords: form.highLightIncorrectWords.map(q => q._id || q),
        writeFromDictation: form.writeFromDictation.map(q => q._id || q),
      };

      if (editingId) {
        await axios.put(`/api/question/listening/${editingId}`, payload);
      } else {
        await axios.post("/api/question/listening", payload);
      }
      setIsModalOpen(false);
      fetchListeningSections();
      fetchUnusedQuestions(); // Re-fetch unused questions after saving
    } catch (err) {
      console.error("Error saving listening section:", err);
      // You might want to show an error message to the user here
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
    setAvailableQuestions(prevAvailable => ({
      ...prevAvailable,
      // Note: `questionType` for form is e.g. `summarizeSpokenTextQuestions`.
      // For availableQuestions, it's `summarizeSpokenText` (no 'Questions' suffix).
      [questionType.replace('Questions', '')]: prevAvailable[questionType.replace('Questions', '')] ? prevAvailable[questionType.replace('Questions', '')].filter(q => q._id !== question._id) : []
    }));
  };

  const handleRemoveQuestionFromForm = (questionType, questionId) => {
    setForm(prevForm => ({
      ...prevForm,
      [questionType]: prevForm[questionType].filter(q => (q._id || q) !== questionId)
    }));
    // Re-fetch unused questions on modal close or save to keep available list accurate
  };

  const handleEditClick = async (section) => {
    setEditingId(section._id);
    // Fetch detailed section data including populated questions
    try {
      const res = await axios.get(`/api/question/listening/${section._id}`);
      const detailedSection = res.data.data;

      setForm({
        title: detailedSection.title,
        summarizeSpokenTextQuestions: detailedSection.summarizeSpokenTextQuestions || [],
        multipleChoiceMultiple: detailedSection.multipleChoiceMultiple || [],
        fillInTheBlanks: detailedSection.fillInTheBlanks || [],
        highlightIncorrectSummary: detailedSection.highlightIncorrectSummary || [],
        multipleChoiceSingle: detailedSection.multipleChoiceSingle || [],
        selectMissingWord: detailedSection.selectMissingWord || [],
        highLightIncorrectWords: detailedSection.highLightIncorrectWords || [],
        writeFromDictation: detailedSection.writeFromDictation || [],
      });
      await fetchUnusedQuestions(); // Ensure fresh unused questions for editing
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch detailed listening section for editing:", err);
      // Handle error, maybe show a message
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Listening section?")) {
      try {
        await axios.delete(`/api/question/listening/${id}`);
        fetchListeningSections();
        fetchUnusedQuestions(); // Re-fetch unused questions after deletion
      } catch (err) {
        console.error("Error deleting listening section:", err);
      }
    }
  };

  const renderQuestionSelection = (questionType, questionsArray, Icon) => (
    <div className="space-y-4 border p-4 rounded-xl bg-slate-50">
      <h3 className="flex items-center gap-2 font-bold text-slate-700">
        <Icon size={20} className="text-orange-500" />
        {questionType.replace(/([A-Z])/g, ' $1').trim().replace('Questions', '')} Questions
        <span className="text-sm text-slate-500 font-normal">({form[questionType].length} selected)</span>
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {form[questionType].map((q) => (
          <span key={q._id || q} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            {q.title || `ID: ${q._id || q}`}
            <button type="button" onClick={() => handleRemoveQuestionFromForm(questionType, q._id || q)} className="ml-1 text-orange-500 hover:text-orange-800"><X size={14} /></button>
          </span>
        ))}
      </div>
      {unusedLoading ? (
        <Loader2 className="animate-spin mx-auto text-orange-400" size={24} />
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-white">
          {questionsArray.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-2">No unused questions of this type.</p>
          ) : (
            questionsArray.map((q) => (
              <button
                type="button"
                key={q._id}
                onClick={() => handleAddQuestionToForm(questionType, q)}
                className="w-full text-left p-2 border rounded-lg hover:bg-orange-50 transition-colors text-sm text-slate-700"
              >
                {q.title || q.text || q.question || `Question ID: ${q._id}`}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );


  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manage Listening Sections</h2>
            <p className="text-slate-500 font-medium">Create and organize PTE Listening test sections</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
              fetchUnusedQuestions(); // Load unused questions for new form
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-100"
          >
            <PlusCircle size={22} /> <span>Create New Listening Section</span>
          </motion.button>
        </div>

        {/* SEARCH */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={20} />
          <input
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by section title..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all"
          />
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={40} /></div>
          ) : filteredListeningSections.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No Listening sections found.</div>
          ) : (
            filteredListeningSections.map((section) => (
              <motion.div key={section._id} whileHover={{ y: -4 }} className="grid grid-cols-1 md:grid-cols-12 items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-orange-200 transition-all group">
                <div className="col-span-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{section.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Listening Module</p>
                  </div>
                </div>
                <div className="col-span-3 text-center text-slate-600 text-sm">
                  {/* Display question counts for each type */}
                  <p>SST: {section.summarizeSpokenTextQuestions?.length || 0} | MCM: {section.multipleChoiceMultiple?.length || 0}</p>
                  <p>FIB: {section.fillInTheBlanks?.length || 0} | HIS: {section.highlightIncorrectSummary?.length || 0}</p>
                  <p>MCS: {section.multipleChoiceSingle?.length || 0} | SMW: {section.selectMissingWord?.length || 0}</p>
                  <p>HIW: {section.highLightIncorrectWords?.length || 0} | WFD: {section.writeFromDictation?.length || 0}</p>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button onClick={() => { setViewData(section); setIsViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><Eye size={18} /></button>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-2xl font-black text-slate-800">{editingId ? "Edit Listening Section" : "New Listening Section"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl shadow-sm"><X size={20} /></button>
                </div>
                <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                  <input
                    placeholder="Section Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderQuestionSelection("summarizeSpokenTextQuestions", availableQuestions.summarizeSpokenText || [], BookAudio)}
                    {renderQuestionSelection("multipleChoiceMultiple", availableQuestions.multipleChoiceMultiple || [], ListChecks)}
                    {renderQuestionSelection("fillInTheBlanks", availableQuestions.fillInTheBlanks || [], GalleryVertical)}
                    {renderQuestionSelection("highlightIncorrectSummary", availableQuestions.highlightIncorrectSummary || [], Highlighter)}
                    {renderQuestionSelection("multipleChoiceSingle", availableQuestions.multipleChoiceSingle || [], CircleDot)}
                    {renderQuestionSelection("selectMissingWord", availableQuestions.selectMissingWord || [], SquareDashedMousePointer)}
                    {renderQuestionSelection("highLightIncorrectWords", availableQuestions.highlightIncorrectWords || [], Highlighter)} {/* Reusing HighlightIncorrectWords icon */}
                    {renderQuestionSelection("writeFromDictation", availableQuestions.writeFromDictation || [], FileText)}
                  </div>

                  <button disabled={submitLoading} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-xl">
                    {submitLoading ? <Loader2 className="animate-spin mx-auto" /> : "Save Listening Section"}
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
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Listening Section</span>
                      <h2 className="text-3xl font-black text-slate-900">{viewData.title}</h2>
                    </div>
                    <button onClick={() => setIsViewModalOpen(false)} className="p-3 bg-slate-100 rounded-full"><X /></button>
                  </div>

                  {/* Display details of questions within this section */}
                  {[
                    { type: "summarizeSpokenTextQuestions", label: "Summarize Spoken Text", icon: BookAudio },
                    { type: "multipleChoiceMultiple", label: "Multiple Choice, Multiple Answer", icon: ListChecks },
                    { type: "fillInTheBlanks", label: "Fill in the Blanks (Listening)", icon: GalleryVertical },
                    { type: "highlightIncorrectSummary", label: "Highlight Incorrect Summary", icon: Highlighter },
                    { type: "multipleChoiceSingle", label: "Multiple Choice, Single Answer", icon: CircleDot },
                    { type: "selectMissingWord", label: "Select Missing Word", icon: SquareDashedMousePointer },
                    { type: "highLightIncorrectWords", label: "Highlight Incorrect Words (Listening)", icon: Highlighter },
                    { type: "writeFromDictation", label: "Write From Dictation", icon: FileText },
                  ].map(({ type, label, icon: Icon }, index) => (
                    viewData[type] && viewData[type].length > 0 && (
                      <div key={index} className="space-y-4">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 border-b pb-2">
                          <Icon className="text-orange-500" size={24} /> {label} ({viewData[type].length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {viewData[type].map(q => (
                            <div key={q} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                              <p className="font-semibold text-slate-700">{q.title || q.text || q.question || `Question ID: ${q}`}</p>
                              {/* Add more specific details, e.g., audio player for listening questions */}
                              {/* {q.audioUrl && (
                                <audio controls src={q.audioUrl} className="w-full mt-2" />
                              )}
                              {q.content && <p className="text-sm text-slate-600 italic mt-1 line-clamp-3">{q.content}</p>}
                              {q.passage && <p className="text-sm text-slate-600 italic mt-1 line-clamp-3">{q.passage}</p>} */}
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

export default ManageListening;