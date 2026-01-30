import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, Edit, Trash2, Search, Eye, Loader2, X, PlusCircle,
  FileText, BookOpen, ListChecks, GalleryVertical, SquareDashedMousePointer,
  ListOrdered, CircleDot, Highlighter, ScanText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import AdminLayout from "../../../../components/Admin/AdminLayout"; // Adjust path as needed

const ManageWriting = () => {
  const { user } = useSelector((state) => state.auth);
  const [readingSections, setReadingSections] = useState([]);
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
    summarizeWrittenText: [],
    fillInTheBlanksDropdown: [],
    multipleChoiceMultiple: [],
    reOrderParagraphs: [],
    fillInTheBlanksWithDragDrop: [],
    multipleChoiceSingle: [],
    highLightCorrectSummary: [],
    highlightIncorrectWords: [],
  };
  const [form, setForm] = useState(initialForm);

  const fetchReadingSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/question/reading"); // Assuming this endpoint gets all reading sections
      setReadingSections(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnusedQuestions = async () => {
    setUnusedLoading(true);
    try {
      const res = await axios.get("/api/question/reading/get/unused"); // This endpoint fetches all unused questions
      setAvailableQuestions(res.data.data || {});
    } catch (err) {
      console.error("Failed to fetch unused questions:", err);
    } finally {
      setUnusedLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingSections();
    fetchUnusedQuestions();
  }, []);

  const filteredReadingSections = useMemo(() => {
    return readingSections.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [readingSections, searchTerm]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        title: form.title,
        summarizeWrittenText: form.summarizeWrittenText.map(q => q._id || q),
        fillInTheBlanksDropdown: form.fillInTheBlanksDropdown.map(q => q._id || q),
        multipleChoiceMultiple: form.multipleChoiceMultiple.map(q => q._id || q),
        reOrderParagraphs: form.reOrderParagraphs.map(q => q._id || q),
        fillInTheBlanksWithDragDrop: form.fillInTheBlanksWithDragDrop.map(q => q._id || q),
        multipleChoiceSingle: form.multipleChoiceSingle.map(q => q._id || q),
        highLightCorrectSummary: form.highLightCorrectSummary.map(q => q._id || q),
        highlightIncorrectWords: form.highlightIncorrectWords.map(q => q._id || q),
      };

      if (editingId) {
        await axios.put(`/api/question/reading/${editingId}`, payload);
      } else {
        await axios.post("/api/question/reading", payload);
      }
      setIsModalOpen(false);
      fetchReadingSections();
      fetchUnusedQuestions(); // Re-fetch unused questions after saving
    } catch (err) {
      console.error("Error saving reading section:", err);
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
      // Note: `questionType` for form is e.g. `summarizeWrittenText`.
      // For availableQuestions, it's `summarizeWrittenText` (no 'Questions' suffix).
      [questionType]: prevAvailable[questionType] ? prevAvailable[questionType].filter(q => q._id !== question._id) : []
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
      const res = await axios.get(`/api/question/reading/${section._id}`);
      const detailedSection = res.data.data;

      setForm({
        title: detailedSection.title,
        summarizeWrittenText: detailedSection.summarizeWrittenText || [],
        fillInTheBlanksDropdown: detailedSection.fillInTheBlanksDropdown || [],
        multipleChoiceMultiple: detailedSection.multipleChoiceMultiple || [],
        reOrderParagraphs: detailedSection.reOrderParagraphs || [],
        fillInTheBlanksWithDragDrop: detailedSection.fillInTheBlanksWithDragDrop || [],
        multipleChoiceSingle: detailedSection.multipleChoiceSingle || [],
        highLightCorrectSummary: detailedSection.highLightCorrectSummary || [],
        highlightIncorrectWords: detailedSection.highlightIncorrectWords || [],
      });
      await fetchUnusedQuestions(); // Ensure fresh unused questions for editing
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch detailed reading section for editing:", err);
      // Handle error, maybe show a message
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Reading section?")) {
      try {
        await axios.delete(`/api/question/reading/${id}`);
        fetchReadingSections();
        fetchUnusedQuestions(); // Re-fetch unused questions after deletion
      } catch (err) {
        console.error("Error deleting reading section:", err);
      }
    }
  };

  const renderQuestionSelection = (questionType, questionsArray, Icon) => (
    <div className="space-y-4 border p-4 rounded-xl bg-slate-50">
      <h3 className="flex items-center gap-2 font-bold text-slate-700">
        <Icon size={20} className="text-indigo-500" />
        {questionType.replace(/([A-Z])/g, ' $1').trim().replace('Questions', '')} Questions
        <span className="text-sm text-slate-500 font-normal">({form[questionType].length} selected)</span>
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {form[questionType].map((q) => (
          <span key={q._id || q} className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            {q.title || `ID: ${q._id || q}`}
            <button type="button" onClick={() => handleRemoveQuestionFromForm(questionType, q._id || q)} className="ml-1 text-indigo-500 hover:text-indigo-800"><X size={14} /></button>
          </span>
        ))}
      </div>
      {unusedLoading ? (
        <Loader2 className="animate-spin mx-auto text-indigo-400" size={24} />
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


  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manage Reading Sections</h2>
            <p className="text-slate-500 font-medium">Create and organize PTE Reading test sections</p>
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
            <PlusCircle size={22} /> <span>Create New Reading Section</span>
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
          ) : filteredReadingSections.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No Reading sections found.</div>
          ) : (
            filteredReadingSections.map((section) => (
              <motion.div key={section._id} whileHover={{ y: -4 }} className="grid grid-cols-1 md:grid-cols-12 items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="col-span-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{section.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Reading Module</p>
                  </div>
                </div>
                <div className="col-span-3 text-center text-slate-600 text-sm">
                  {/* Display question counts for each type */}
                  <p>SWT: {section.summarizeWrittenText?.length || 0} | FIB-D: {section.fillInTheBlanksDropdown?.length || 0}</p>
                  <p>MCM: {section.multipleChoiceMultiple?.length || 0} | RO: {section.reOrderParagraphs?.length || 0}</p>
                  <p>FIB-DD: {section.fillInTheBlanksWithDragDrop?.length || 0} | MCS: {section.multipleChoiceSingle?.length || 0}</p>
                  <p>HCS: {section.highLightCorrectSummary?.length || 0} | HIW: {section.highlightIncorrectWords?.length || 0}</p>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-2xl font-black text-slate-800">{editingId ? "Edit Reading Section" : "New Reading Section"}</h2>
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
                    {renderQuestionSelection("summarizeWrittenText", availableQuestions.summarizeWrittenText || [], ScanText)}
                    {renderQuestionSelection("fillInTheBlanksDropdown", availableQuestions.fillInTheBlanksDropdown || [], GalleryVertical)}
                    {renderQuestionSelection("multipleChoiceMultiple", availableQuestions.multipleChoiceMultiple || [], ListChecks)}
                    {renderQuestionSelection("reOrderParagraphs", availableQuestions.reOrderParagraphs || [], ListOrdered)}
                    {renderQuestionSelection("fillInTheBlanksWithDragDrop", availableQuestions.fillInTheBlanksWithDragDrop || [], SquareDashedMousePointer)}
                    {renderQuestionSelection("multipleChoiceSingle", availableQuestions.multipleChoiceSingle || [], CircleDot)}
                    {renderQuestionSelection("highLightCorrectSummary", availableQuestions.highLightCorrectSummary || [], Highlighter)}
                    {renderQuestionSelection("highlightIncorrectWords", availableQuestions.highlightIncorrectWords || [], ScanText)} {/* Reusing ScanText icon */}
                  </div>

                  <button disabled={submitLoading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl">
                    {submitLoading ? <Loader2 className="animate-spin mx-auto" /> : "Save Reading Section"}
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
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Reading Section</span>
                      <h2 className="text-3xl font-black text-slate-900">{viewData.title}</h2>
                    </div>
                    <button onClick={() => setIsViewModalOpen(false)} className="p-3 bg-slate-100 rounded-full"><X /></button>
                  </div>

                  {/* Display details of questions within this section */}
                  {[
                    { type: "summarizeWrittenText", label: "Summarize Written Text", icon: ScanText },
                    { type: "fillInTheBlanksDropdown", label: "Fill in the Blanks (Dropdown)", icon: GalleryVertical },
                    { type: "multipleChoiceMultiple", label: "Multiple Choice, Multiple Answer", icon: ListChecks },
                    { type: "reOrderParagraphs", label: "Re-order Paragraphs", icon: ListOrdered },
                    { type: "fillInTheBlanksWithDragDrop", label: "Fill in the Blanks (Drag & Drop)", icon: SquareDashedMousePointer },
                    { type: "multipleChoiceSingle", label: "Multiple Choice, Single Answer", icon: CircleDot },
                    { type: "highLightCorrectSummary", label: "Highlight Correct Summary", icon: Highlighter },
                    { type: "highlightIncorrectWords", label: "Highlight Incorrect Words (Reading)", icon: ScanText },
                  ].map(({ type, label, icon: Icon }, index) => (
                    viewData[type] && viewData[type].length > 0 && (
                      <div key={index} className="space-y-4">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 border-b pb-2">
                          <Icon className="text-green-500" size={24} /> {label} ({viewData[type].length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {viewData[type].map(q => (
                            <div key={q} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                              <p className="font-semibold text-slate-700">{q.title || q.text || q.question || `Question ID: ${q}`}</p>
                              {/* Add more specific details if needed */}
                              {/* {q.content && <p className="text-sm text-slate-600 italic mt-1 line-clamp-3">{q.content}</p>} */}
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

export default ManageWriting;