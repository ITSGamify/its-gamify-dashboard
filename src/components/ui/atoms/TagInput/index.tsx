// src/sections/course/components/TagInput.tsx
import React from "react";
import { Box, TextField, Button, Chip, FormHelperText } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface TagInputProps {
  tags: string[];
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  handleAddTag: (tag: string) => void;
  handleDeleteTag: (tag: string) => void;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  tags = [], // Cung cấp giá trị mặc định là mảng rỗng
  currentTag,
  setCurrentTag,
  handleAddTag,
  handleDeleteTag,
  maxTags = 5,
}) => {
  // Đảm bảo tags luôn là một mảng
  const tagArray = Array.isArray(tags) ? tags : [];

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Thêm thẻ (nhấn Enter hoặc nhấp vào nút +)"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag(currentTag.trim());
              setCurrentTag("");
            }
          }}
          sx={{ mr: 1 }}
          disabled={tagArray.length >= maxTags}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleAddTag(currentTag.trim());
            setCurrentTag("");
          }}
          disabled={!currentTag.trim() || tagArray.length >= maxTags}
        >
          <AddIcon />
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tagArray.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
      <FormHelperText>
        Thêm tối đa {maxTags} thẻ liên quan đến nội dung khóa học để giúp học
        viên tìm thấy khóa học của bạn dễ dàng hơn
      </FormHelperText>
    </Box>
  );
};

export default TagInput;
