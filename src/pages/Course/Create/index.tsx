// src/pages/CreateCoursePage.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  useTheme,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { StepperWrapper } from "@components/ui/atoms/StepperWrapper";
import BasicInfoForm from "@components/ui/molecules/BasicInfoForm";
import CourseContentForm from "@components/ui/molecules/CourseContentForm";
import LearningMaterialsForm from "@components/ui/molecules/LearningMaterialsForm";
import PreviewPublishForm from "@components/ui/molecules/PreviewPublishForm";
import { useCourseForm } from "@hooks/data/useCourseForm";

const steps = [
  "Thông tin cơ bản",
  "Nội dung khóa học",
  "Tài liệu học tập",
  "Xem trước & Xuất bản",
];

const CreateCoursePage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const {
    courseData,
    modules,
    handleCourseDataChange,
    handleModuleChange,
    handleAddModule,
    handleDeleteModule,
    handleAddLesson,
    handleLessonChange,
    handleDeleteLesson,
    onDragEnd,
  } = useCourseForm();

  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Render different steps based on activeStep
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoForm
            courseData={courseData}
            handleCourseDataChange={handleCourseDataChange}
          />
        );
      case 1:
        return (
          <CourseContentForm
            modules={modules}
            handleModuleChange={handleModuleChange}
            handleAddModule={handleAddModule}
            handleDeleteModule={handleDeleteModule}
            handleAddLesson={handleAddLesson}
            handleLessonChange={handleLessonChange}
            handleDeleteLesson={handleDeleteLesson}
            onDragEnd={onDragEnd}
          />
        );
      case 2:
        return (
          <LearningMaterialsForm
            courseData={courseData}
            handleCourseDataChange={handleCourseDataChange}
          />
        );
      case 3:
        return <PreviewPublishForm courseData={courseData} modules={modules} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Container>
        {/* Page Header */}
        <Box mb={6}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Tạo khóa học mới
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hoàn thành các bước dưới đây để tạo khóa học của bạn
          </Typography>
        </Box>

        {/* Stepper */}
        <StepperWrapper>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperWrapper>

        {/* Step Content */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "20px",
            boxShadow: theme.shadows[8],
          }}
        >
          {renderStepContent()}
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Quay lại
          </Button>
          <Box>
            <Button variant="outlined" sx={{ mr: 1 }} startIcon={<SaveIcon />}>
              Lưu nháp
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" color="primary">
                Xuất bản khóa học
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Tiếp theo
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateCoursePage;
