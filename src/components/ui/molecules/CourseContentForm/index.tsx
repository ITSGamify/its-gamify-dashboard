import React, { Fragment } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import ModuleCard from "@components/ui/atoms/ModuleCard";
import { useCourseContentForm } from "@hooks/data/useCourseContentForm";
import { StepFormProps } from "@interfaces/api/course";
import { Save as SaveIcon } from "@mui/icons-material";
import { STEPS } from "@constants/course";
import CustomButton from "@components/ui/atoms/CustomButton";

const CourseContentForm = ({
  data,
  handleNextState,
  handleBack,
  activeStep,
  isLoading,
}: StepFormProps) => {
  const {
    handleAddModule,
    handleRemoveModule,
    modules,
    isCreatePending,
    updateModulesAfterDrag,
    handleNext,
    isLoadingModules,
  } = useCourseContentForm({
    data,
    handleNextState,
  });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }
    try {
      const sourceModuleIndex = parseInt(source.droppableId, 10);
      const destModuleIndex = parseInt(destination.droppableId, 10);
      if (isNaN(sourceModuleIndex) || isNaN(destModuleIndex)) {
        console.error("Invalid module index format");
        return;
      }
      const currentModules = modules;
      if (
        sourceModuleIndex < 0 ||
        sourceModuleIndex >= currentModules.length ||
        destModuleIndex < 0 ||
        destModuleIndex >= currentModules.length
      ) {
        console.error("Invalid module indexes or modules structure");
        return;
      }
      const updatedModules = JSON.parse(JSON.stringify(currentModules));
      if (sourceModuleIndex === destModuleIndex) {
        const moduleToUpdate = updatedModules[sourceModuleIndex];
        const lessons = [...moduleToUpdate.lessons];
        const [movedLesson] = lessons.splice(source.index, 1);
        lessons.splice(destination.index, 0, movedLesson);
        lessons.forEach((lesson, idx) => {
          lesson.index = idx;
        });
        moduleToUpdate.lessons = lessons;
      } else {
        const sourceModule = updatedModules[sourceModuleIndex];
        const destModule = updatedModules[destModuleIndex];
        const sourceLessons = [...sourceModule.lessons];
        const destLessons = [...destModule.lessons];
        const [movedLesson] = sourceLessons.splice(source.index, 1);
        destLessons.splice(destination.index, 0, movedLesson);
        sourceLessons.forEach((lesson, idx) => {
          lesson.index = idx;
        });
        destLessons.forEach((lesson, idx) => {
          lesson.index = idx;
        });
        sourceModule.lessons = sourceLessons;
        destModule.lessons = destLessons;
      }
      updateModulesAfterDrag(updatedModules);
    } catch (error) {
      console.error("Error in handleDragEnd:", error);
    }
  };

  const theme = useTheme();

  return (
    <Fragment>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "20px",
          boxShadow: theme.shadows[8],
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <SectionTitle variant="h6" fontWeight={600}>
                Nội dung khóa học
              </SectionTitle>
              <CustomButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddModule}
                disabled={isCreatePending}
              >
                Thêm mới
              </CustomButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            {isLoadingModules ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <DragDropContext onDragEnd={handleDragEnd}>
                  {modules.map((module, index) => (
                    <ModuleCard
                      key={`module-${module.id}-${index}`}
                      index={index}
                      module={module}
                      handleDeleteModule={handleRemoveModule}
                      isLast={modules.length === 1}
                    />
                  ))}
                </DragDropContext>

                {modules.length === 0 && (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Chưa có module nào
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddModule}
                    >
                      Thêm module đầu tiên
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || isLoading}
        >
          Quay lại
        </Button>
        <Box>
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            Lưu nháp
          </Button>
          {activeStep === STEPS.length - 1 ? (
            <Button variant="contained" color="primary">
              Xuất bản khóa học
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Đang xử lý..." : "Tiếp theo"}
            </Button>
          )}
        </Box>
      </Box>
    </Fragment>
  );
};
export default CourseContentForm;
