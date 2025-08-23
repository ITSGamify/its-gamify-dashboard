import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { SectionTitle } from "@components/ui/atoms/SectionTitle";
import { ChallengeStepFormProps } from "@interfaces/api/challenge";
import { ChallengeInforForm } from "@hooks/data/useChallengeForm";
import PreviewChallengeTable from "@components/ui/atoms/PreviewChallengeTable";

const ChallengeConfirmStep = ({
  activeStep,
  handleBack,
  isLoading,
  isCreateMode,
  formData: confirmData,
  handleConfirm,
}: ChallengeStepFormProps) => {
  const theme = useTheme();

  const formData = confirmData as ChallengeInforForm & {};

  return (
    <Box>
      <Card
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "20px",
          boxShadow: theme.shadows[8],
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" fontWeight={600}>
              Xác Nhận Thông Tin Thử Thách
            </SectionTitle>
            <Typography variant="body2" color="text.secondary">
              Vui lòng kiểm tra lại thông tin trước khi tạo thử thách.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Khóa Học
            </Typography>
            <Typography variant="body1">
              {formData?.title || "Chưa chọn"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Tiêu Đề
            </Typography>
            <Typography variant="body1">
              {formData?.title || "Chưa nhập"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Mô Tả
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {formData?.description || "Chưa nhập"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Ảnh Thumbnail
            </Typography>
            {formData?.thumbnail_image ? (
              <Box
                component="img"
                src={formData.thumbnail_image}
                alt="Thumbnail"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 2,
                  maxHeight: 200,
                }}
              />
            ) : (
              <Typography variant="body1">Chưa tải lên</Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" fontWeight={600}>
              Câu hỏi cho thử thách
            </SectionTitle>
          </Grid>

          {/* Tích hợp modal hiển thị danh sách questions */}
          <PreviewChallengeTable
            courseId={formData.course_id}
            isPreview={true}
            newQuestions={confirmData?.new_questions || []}
            updatedQuestions={confirmData?.updated_questions || []}
          />
        </Grid>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || isLoading}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading
            ? "Đang xử lý..."
            : isCreateMode
            ? "Tạo Thử Thách"
            : "Xác Nhận"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChallengeConfirmStep;
