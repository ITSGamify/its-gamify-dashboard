import { PreviewHeadCell } from "@interfaces/dom/preview";

export const QESTION_REVIEW_HEAD: PreviewHeadCell[] = [
  {
    id: "content",
    label: "Câu hỏi",
    type: "question-cell",
  },
  {
    id: "answer_a",
    label: "Đáp án A",
    type: "answer-cell",
  },
  {
    id: "answer_b",
    label: "Đáp án B",
    type: "answer-cell",
  },
  {
    id: "answer_c",
    label: "Đáp án C",
    type: "answer-cell",
  },
  {
    id: "answer_d",
    label: "Đáp án D",
    type: "answer-cell",
  },
  {
    id: "correct_answer",
    label: "Đáp án đúng",
    type: "correct-cell",
  },
  {
    id: "description",
    label: "Giải thích",
    type: "description-cell",
  },
];

export const PRACTICE_REVIEW_HEAD: PreviewHeadCell[] = [
  {
    id: "content",
    label: "Câu hỏi",
    type: "question-cell",
  },
  {
    id: "description",
    label: "Giải thích",
    type: "description-cell",
  },
];
