// src/sections/course/components/lesson-types/VideoLessonContent.tsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  InputAdornment,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { Control, Controller, useWatch } from "react-hook-form";
import { textFieldStyles } from "../LessonCard";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Module } from "@interfaces/dom/course";
import {
  useS3InitialUpload,
  useS3GetPresignUrlUpload,
  useS3CompletedUpload,
  InitiateMultipartUploadParam,
  GeneratePresignedUrlParam,
  CompleteMultipartUploadModel,
  PartETag,
} from "@services/fileUpload";
import axios from "axios"; // Import axios để upload part
import { CHUNK_SIZE } from "@constants/file";

interface VideoLessonContentProps {
  moduleIndex: number;
  lessonIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Module, any, Module>;
  isEditing?: boolean;
}

const VideoLessonContent: React.FC<VideoLessonContentProps> = ({
  lessonIndex,
  control,
  isEditing = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const initialUploadMutation = useS3InitialUpload();
  const getPresignUrlMutation = useS3GetPresignUrlUpload();
  const completeUploadMutation = useS3CompletedUpload();

  const videoUrl = useWatch({
    control,
    name: `lessons.${lessonIndex}.video_url`,
    defaultValue: "",
  });

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        // Chuyển đổi từ giây sang phút và làm tròn lên
        const durationInMinutes = Math.ceil(video.duration / 60);
        resolve(durationInMinutes);
      };

      video.onerror = () => {
        reject("Không thể đọc thông tin video");
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (url: string) => void,
    setDuration: (duration: number) => void
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setIsUploading(true);
      setUploadError(null);

      try {
        if (!file.type.startsWith("video/")) {
          setUploadError("Chỉ chấp nhận file video");
          return;
        }

        let duration: number;
        try {
          duration = await getVideoDuration(file);

          if (duration < 1 || duration > 5) {
            setUploadError(
              `Thời lượng video phải từ 1-5 phút. Video của bạn dài ${duration} phút.`
            );
            return;
          }
        } catch (error) {
          console.error("Không thể lấy thời lượng video:", error);
          setUploadError(
            "Không thể xác định thời lượng video. Vui lòng thử lại."
          );
          return;
        }

        // Bắt đầu multipart upload
        const fileName = file.name; // Hoặc generate unique name nếu cần
        const initParams: InitiateMultipartUploadParam = {
          file_name: fileName,
        };
        const uploadId = await initialUploadMutation.mutateAsync(initParams);

        // Chia file thành các parts
        const totalParts = Math.ceil(file.size / CHUNK_SIZE);
        const partETags: PartETag[] = [];

        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          // Lấy presigned URL cho part
          const presignParams: GeneratePresignedUrlParam = {
            file_name: fileName,
            upload_id: uploadId,
            part_number: partNumber,
          };
          const presignedUrl = await getPresignUrlMutation.mutateAsync(
            presignParams
          );

          // Upload part lên S3 bằng presigned URL
          const response = await axios.put(presignedUrl, chunk, {
            headers: {
              "Content-Type": file.type,
            },
          });

          // Lấy ETag từ response headers
          const eTag = response.headers.etag;
          if (!eTag) {
            throw new Error(`Không lấy được ETag cho part ${partNumber}`);
          }
          partETags.push({ part_number: partNumber, e_tag: eTag });
        }

        // Hoàn tất upload
        const completeParams: CompleteMultipartUploadModel = {
          file_name: fileName,
          upload_id: uploadId,
          part_e_tags: partETags,
        };
        const finalUrl = await completeUploadMutation.mutateAsync(
          completeParams
        );

        // Cập nhật URL video
        onChange(finalUrl);

        setDuration(duration);
      } catch (error) {
        console.error("Lỗi khi tải lên video multipart:", error);
        setUploadError("Đã xảy ra lỗi khi tải lên video. Vui lòng thử lại.");
      } finally {
        setIsUploading(false);
      }

      // Reset input để có thể chọn lại file đó nếu muốn
      event.target.value = "";
    }
  };

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef) {
      videoRef.muted = !videoRef.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef) {
      if (videoRef.requestFullscreen) {
        videoRef.requestFullscreen();
      }
    }
  };

  // Reset trạng thái khi URL video thay đổi
  useEffect(() => {
    setIsPlaying(false);
  }, [videoUrl]);

  return (
    <Grid size={{ xs: 12 }}>
      <Controller
        name={`lessons.${lessonIndex}.video_url`}
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <>
            <TextField
              fullWidth
              size="small"
              label="URL video"
              placeholder="Nhập URL video hoặc tải lên"
              value={field.value || ""}
              onChange={field.onChange}
              error={!!error}
              helperText={error?.message}
              disabled={!isEditing || isUploading}
              sx={textFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Controller
                      name={`lessons.${lessonIndex}.duration`}
                      control={control}
                      render={({ field: durationField }) => (
                        <Button
                          size="small"
                          component="label"
                          disabled={!isEditing || isUploading}
                          startIcon={
                            isUploading ? (
                              <CircularProgress size={16} />
                            ) : undefined
                          }
                        >
                          {isUploading ? "Đang tải..." : "Tải lên"}
                          <input
                            type="file"
                            hidden
                            accept="video/*"
                            onChange={(e) => {
                              handleVideoUpload(
                                e,
                                field.onChange,
                                durationField.onChange
                              );
                            }}
                          />
                        </Button>
                      )}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {uploadError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {uploadError}
              </Alert>
            )}
            <Typography variant="caption" color="text.secondary">
              Thời lượng video phải từ 1-5 phút. Thời lượng bài học sẽ được cập
              nhật tự động.
            </Typography>

            {/* Video Preview */}
            {videoUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Xem trước video:
                </Typography>
                <Paper
                  elevation={2}
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    overflow: "hidden",
                    backgroundColor: "#000",
                    maxWidth: "100%",
                    width: "100%",
                    aspectRatio: "16/9",
                  }}
                >
                  <video
                    ref={(ref) => setVideoRef(ref)}
                    src={videoUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    onEnded={() => setIsPlaying(false)}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    preload="metadata"
                    playsInline
                  />

                  {/* Video Controls */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      padding: 1,
                    }}
                  >
                    <IconButton
                      onClick={handlePlayPause}
                      sx={{ color: "white" }}
                      size="small"
                    >
                      {isPlaying ? (
                        <PauseCircleOutlineIcon />
                      ) : (
                        <PlayCircleOutlineIcon />
                      )}
                    </IconButton>

                    <IconButton
                      onClick={handleMuteToggle}
                      sx={{ color: "white" }}
                      size="small"
                    >
                      {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                      onClick={handleFullscreen}
                      sx={{ color: "white" }}
                      size="small"
                    >
                      <FullscreenIcon />
                    </IconButton>
                  </Box>
                </Paper>

                <Controller
                  name={`lessons.${lessonIndex}.duration`}
                  control={control}
                  render={({ field }) => (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Thời lượng: {field.value || 0} phút
                    </Typography>
                  )}
                />
              </Box>
            )}
          </>
        )}
      />
    </Grid>
  );
};

export default VideoLessonContent;
