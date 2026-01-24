// Onboarding Components
import TestInstructions from "./Onboarding/TestInstructions";
import HeadsetCheck from "./Onboarding/HeadsetCheck";
import MicrophoneCheck from "./Onboarding/MicrophoneCheck";
import TestTips from "./Onboarding/TestTips";
import PersonalIntroduction from "./Onboarding/PersonalIntroduction";
import StartExamScreen from "./Onboarding/StartExamScreen";

// Components
import FullMockTestIntro from "./FullMockTestIntro";
import PartIntroScreen from "./PartIntroScreen";
// import APEUniSpeakingMockTest from "../SectionalTest/Speaking";
// import APEUniWritingMockTest from "../SectionalTest/Writing";
// import APEUniReadingTest from "../SectionalTest/Reading";
// import APEUniListeningTest from "../SectionalTest/Listening";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFullMockTestById } from "../../../services/api";
import axios from "axios";

// Constants
const STEPS = {
    INTRO: "INTRO",
    INSTRUCTIONS: "INSTRUCTIONS",
    HEADSET_CHECK: "HEADSET_CHECK",
    MIC_CHECK: "MIC_CHECK",
    TIPS: "TIPS",
    PERSONAL_INTRO: "PERSONAL_INTRO",
    START_EXAM_SCREEN: "START_EXAM_SCREEN",
    PART1_INTRO: "PART1_INTRO",
    SPEAKING: "SPEAKING",
    WRITING: "WRITING",
    PART2_INTRO: "PART2_INTRO",
    READING: "READING",
    PART3_INTRO: "PART3_INTRO",
    LISTENING: "LISTENING",
    FINISHED: "FINISHED",
};

export default function FullExamRunner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(STEPS.INTRO);
    const [aggregatedAnswers, setAggregatedAnswers] = useState({
        speaking: [],
        writing: [],
        reading: [],
        listening: []
    });

    useEffect(() => {
        async function loadTest() {
            try {
                const response = await getFullMockTestById(id);
                if (response.success) {
                    setTestData(response.data);
                } else {
                    alert("Failed to load test");
                }
            } catch (err) {
                console.error(err);
                alert("Error loading test data");
            } finally {
                setLoading(false);
            }
        }
        loadTest();
    }, [id]);

    /* --- HANDLERS --- */

    const handleSpeakingComplete = (answers) => {
        setAggregatedAnswers(prev => ({ ...prev, speaking: answers }));
        setCurrentStep(STEPS.WRITING);
    };

    const handleWritingComplete = (answers) => {
        setAggregatedAnswers(prev => ({ ...prev, writing: answers }));
        setCurrentStep(STEPS.PART2_INTRO);
    };

    const handleReadingComplete = (answers) => {
        setAggregatedAnswers(prev => ({ ...prev, reading: answers }));
        setCurrentStep(STEPS.PART3_INTRO);
    };

    const handleListeningComplete = async (answers) => {
        const finalAnswers = { ...aggregatedAnswers, listening: answers };
        setAggregatedAnswers(finalAnswers);

        // SUBMIT TO BACKEND
        try {
            setLoading(true);
            const formData = new FormData();

            // Collect all answers
            const allAnswers = [
                ...finalAnswers.speaking,
                ...finalAnswers.writing,
                ...finalAnswers.reading,
                ...answers
            ];

            const answersPayload = [];

            allAnswers.forEach((ans) => {
                if (ans.audio instanceof Blob) {
                    // Append File
                    const filename = `audio_${ans.questionId}.wav`;
                    formData.append(`audio_${ans.questionId}`, ans.audio, filename);
                    // Add metadata (excluding blob)
                    answersPayload.push({ ...ans, audio: undefined, hasAudio: true });
                } else {
                    answersPayload.push(ans);
                }
            });

            formData.append("answers", JSON.stringify(answersPayload));

            const res = await axios.post(`/api/mocktest/full/${id}/submit`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                // Success
                console.log("Result Saved:", res.data.data);
            }
        } catch (err) {
            console.error("Full Mock Submission Failed:", err);
            alert("Failed to save test results. Please check console.");
        } finally {
            setLoading(false);
            setCurrentStep(STEPS.FINISHED);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Full Mock Test...</div>;
    if (!testData) return <div className="p-20 text-center text-red-500">Test Not Found</div>;

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">

            {/* 0. GLOBAL INTRO */}
            {currentStep === STEPS.INTRO && (
                <FullMockTestIntro onStart={() => setCurrentStep(STEPS.INSTRUCTIONS)} />
            )}

            {/* 0b. ONBOARDING */}
            {currentStep === STEPS.INSTRUCTIONS && (
                <TestInstructions onNext={() => setCurrentStep(STEPS.HEADSET_CHECK)} />
            )}

            {currentStep === STEPS.HEADSET_CHECK && (
                <HeadsetCheck onNext={() => setCurrentStep(STEPS.MIC_CHECK)} />
            )}

            {currentStep === STEPS.MIC_CHECK && (
                <MicrophoneCheck onNext={() => setCurrentStep(STEPS.TIPS)} />
            )}

            {currentStep === STEPS.TIPS && (
                <TestTips onNext={() => setCurrentStep(STEPS.PERSONAL_INTRO)} />
            )}

            {/* 0c. PERSONAL INTRO (NEW) */}
            {currentStep === STEPS.PERSONAL_INTRO && (
                <PersonalIntroduction onNext={() => setCurrentStep(STEPS.START_EXAM_SCREEN)} />
            )}

            {/* 0d. START SCREEN (NEW) */}
            {currentStep === STEPS.START_EXAM_SCREEN && (
                <StartExamScreen onNext={() => {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(e => console.log(e));
                    }
                    setCurrentStep(STEPS.PART1_INTRO);
                }} />
            )}

            {/* 1. PART 1 INTRO */}
            {currentStep === STEPS.PART1_INTRO && (
                <PartIntroScreen
                    partName="Part 1"
                    title="Speaking and Writing"
                    timeAllowed="77-93 minutes"
                    contentList={[
                        "Introduction",
                        "Read Aloud",
                        "Repeat Sentence",
                        "Describe Image",
                        "Re-tell Lecture",
                        "Answer Short Question",
                        "Summarize Written Text",
                        "Write Essay"
                    ]}
                    onNext={() => setCurrentStep(STEPS.SPEAKING)}
                />
            )}

            {currentStep === STEPS.SPEAKING && (
                {/* <APEUniSpeakingMockTest
                    backendData={{ ...testData.speaking, _id: testData._id }}
                    isFullMock={true}
                    onComplete={handleSpeakingComplete}
                /> */}
            )}

            {currentStep === STEPS.WRITING && (
                {/* <APEUniWritingMockTest
                    backendData={{ ...testData.writing, _id: testData._id }}
                    isFullMock={true}
                    onComplete={handleWritingComplete}
                /> */}
            )}

            {/* 2. PART 2 INTRO */}
            {currentStep === STEPS.PART2_INTRO && (
                <PartIntroScreen
                    partName="Part 2"
                    title="Reading"
                    timeAllowed="29-30 minutes"
                    contentList={[
                        "Fill in the Blanks (R & W)",
                        "Multiple Choice (Multiple)",
                        "Re-order Paragraphs",
                        "Fill in the Blanks (Reading)",
                        "Multiple Choice (Single)"
                    ]}
                    onNext={() => setCurrentStep(STEPS.READING)}
                />
            )}

            {currentStep === STEPS.READING && (
                {/* <APEUniReadingTest
                    backendData={{ ...testData.reading, _id: testData._id, title: "Full Mock Reading" }}
                    isFullMock={true}
                    onComplete={handleReadingComplete}
                /> */}
            )}

            {/* 3. PART 3 INTRO */}
            {currentStep === STEPS.PART3_INTRO && (
                <PartIntroScreen
                    partName="Part 3"
                    title="Listening"
                    timeAllowed="30-43 minutes"
                    contentList={[
                        "Summarize Spoken Text",
                        "Multiple Choice (Multiple)",
                        "Fill in the Blanks",
                        "Highlight Correct Summary",
                        "Multiple Choice (Single)",
                        "Select Missing Word",
                        "Highlight Incorrect Words",
                        "Write from Dictation"
                    ]}
                    onNext={() => setCurrentStep(STEPS.LISTENING)}
                />
            )}

            {currentStep === STEPS.LISTENING && (
                {/* <APEUniListeningTest
                    backendData={{ ...testData.listening, _id: testData._id }}
                    isFullMock={true}
                    onComplete={handleListeningComplete}
                /> */}
            )}

            {currentStep === STEPS.FINISHED && (
                <div className="p-20 text-center mt-20 bg-white shadow-lg max-w-2xl mx-auto rounded-lg">
                    <h1 className="text-3xl font-bold text-[#008199] mb-4">Exam Completed!</h1>
                    <p className="text-gray-600 mb-8">
                        Your answers have been saved locally.
                    </p>
                    <button onClick={() => navigate("/dashboard")} className="bg-gray-800 text-white px-8 py-3 rounded font-bold">
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
