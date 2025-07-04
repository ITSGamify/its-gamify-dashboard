// src/pages/CreateCoursePage.tsx
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from "@mui/material";
import { StepperWrapper } from "@components/ui/atoms/StepperWrapper";
import { useCourseForm } from "@hooks/data/useCourseRequestForm";
import { STEPS } from "@constants/course";

const CreateCoursePage = () => {
  const {
    ActiveStepForm,
    courseDetail,
    handleNextStep,
    activeStep,
    handleBack,
    isLoading,
  } = useCourseForm();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
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
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperWrapper>

        <ActiveStepForm
          data={courseDetail}
          handleNextState={handleNextStep}
          activeStep={activeStep}
          handleBack={handleBack}
          isLoading={isLoading}
        />

        {/* Navigation Buttons */}
      </Container>
    </Box>
  );
};

export default CreateCoursePage;
