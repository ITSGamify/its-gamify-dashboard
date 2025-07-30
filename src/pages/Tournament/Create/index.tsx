import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { StepperWrapper } from "@components/ui/atoms/StepperWrapper";

import { useChallengeRequestForm } from "@hooks/data/useChallengeRequestForm";
import { TOURNAMENT_STEPS } from "@constants/tournament";

const ChallengeCreatePage = () => {
  const {
    ActiveStepForm,
    handleNextStep,
    activeStep,
    handleBack,
    isLoadingForm,
    isLoading,
    formData,
    handleConfirm,
  } = useChallengeRequestForm(undefined, false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Container>
        <Box mb={6}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Tạo thử thách mới
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hoàn thành các bước dưới đây để tạo thử thách mới
          </Typography>
        </Box>

        {/* Stepper */}
        <StepperWrapper>
          <Stepper activeStep={activeStep} alternativeLabel>
            {TOURNAMENT_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperWrapper>
        {isLoadingForm ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ActiveStepForm
            data={null}
            handleNextState={handleNextStep}
            activeStep={activeStep}
            handleBack={handleBack}
            isLoading={isLoading}
            formData={formData || null}
            handleConfirm={handleConfirm}
          />
        )}
      </Container>
    </Box>
  );
};

export default ChallengeCreatePage;
