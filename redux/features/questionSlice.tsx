import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiCall } from "@/app/api/handleApiCall";

interface Question {
    id: number;
    question: string;
    options?: string[];
    placeholder?: string;
    solution?: string;
    type: 'mcq' | 'code';
    correct?: number;
}

interface QuestionApiResponse {
    message: string;
    success: boolean;
    topic: string;
    total_questions: number;
    questions: Question[];
}

interface QuestionState {
    questions: Question[];
    loading: boolean;
    error: string | null;
    topic: string | null;
    totalQuestions: number;
    currentQuestionIndex: number;
    answers: Record<number, string | number>; // Store user answers
    score: number | null;
    completed: boolean;
}

const initialState: QuestionState = {
    questions: [],
    loading: false,
    error: null,
    topic: null,
    totalQuestions: 0,
    currentQuestionIndex: 0,
    answers: {},
    score: null,
    completed: false,
};



// Async thunk for generating questions using handleApiCall
export const generateQuestions = createAsyncThunk(
    'questions/generate',
    async (topic: string, { rejectWithValue }) => {
        try {
            console.log('Generating questions for topic:', topic);
            const response = await handleApiCall<QuestionApiResponse>({
                url: `${process.env.NEXT_PUBLIC_QUESTION_API_URL}/api/generate-quiz`,
                method: 'POST',
                data: { topic },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Questions API response:', response);
            
            if (!response.success) {
                return rejectWithValue(response.message || 'Question generation failed');
            }
            
            return response;
        } catch (error: any) {
            console.error('Questions API error:', error);
            return rejectWithValue(error.message || 'Failed to generate questions');
        }
    }
);

// ...rest of the code remains the same...
const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        // Set answer for a specific question
        setAnswer: (state, action) => {
            const { questionId, answer } = action.payload;
            state.answers[questionId] = answer;
        },
        
        // Navigate to next question
        nextQuestion: (state) => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex += 1;
            }
        },
        
        // Navigate to previous question
        previousQuestion: (state) => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex -= 1;
            }
        },
        
        // Go to specific question
        goToQuestion: (state, action) => {
            const index = action.payload;
            if (index >= 0 && index < state.questions.length) {
                state.currentQuestionIndex = index;
            }
        },
        
        // Reset quiz state
        resetQuiz: (state) => {
            state.questions = [];
            state.currentQuestionIndex = 0;
            state.answers = {};
            state.score = null;
            state.completed = false;
            state.error = null;
            state.topic = null;
            state.totalQuestions = 0;
        },
        
        // Mark quiz as completed
        completeQuiz: (state) => {
            state.completed = true;
        },
        
        // Clear error
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle generateQuestions
            .addCase(generateQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload.questions;
                state.topic = action.payload.topic;
                state.totalQuestions = action.payload.total_questions;
                state.currentQuestionIndex = 0;
                state.answers = {};
                state.completed = false;
                state.score = null;
            })
            .addCase(generateQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to generate questions';
            })
    },
});

// Export actions
export const {
    setAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    resetQuiz,
    completeQuiz,
    clearError
} = questionSlice.actions;

// Selectors
export const selectQuestions = (state: { questions: QuestionState }) => state.questions.questions;
export const selectCurrentQuestion = (state: { questions: QuestionState }) => {
    const { questions, currentQuestionIndex } = state.questions;
    return questions[currentQuestionIndex];
};
export const selectCurrentQuestionIndex = (state: { questions: QuestionState }) => state.questions.currentQuestionIndex;
export const selectAnswers = (state: { questions: QuestionState }) => state.questions.answers;
export const selectAnswer = (questionId: number) => (state: { questions: QuestionState }) => 
    state.questions.answers[questionId];
export const selectQuestionsLoading = (state: { questions: QuestionState }) => state.questions.loading;
export const selectQuestionsError = (state: { questions: QuestionState }) => state.questions.error;
export const selectQuizCompleted = (state: { questions: QuestionState }) => state.questions.completed;
export const selectQuizScore = (state: { questions: QuestionState }) => state.questions.score;
export const selectTopic = (state: { questions: QuestionState }) => state.questions.topic;
export const selectTotalQuestions = (state: { questions: QuestionState }) => state.questions.totalQuestions;

// Progress selectors
export const selectQuizProgress = (state: { questions: QuestionState }) => {
    const { currentQuestionIndex, totalQuestions } = state.questions;
    return totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
};

export const selectAnsweredQuestions = (state: { questions: QuestionState }) => {
    return Object.keys(state.questions.answers).length;
};

export const selectIsQuestionAnswered = (questionId: number) => (state: { questions: QuestionState }) => {
    return questionId in state.questions.answers;
};

export default questionSlice.reducer;