// src/pages/Login/index.tsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useCustomTranslation from "@hooks/shared/useTranslation";
import LoginButton from "@components/ui/atoms/LoginButton";
import LoginInput from "@components/ui/atoms/LoginInput";
import logoImage from "@assets/images/its-gamify-logo.png";
import bannerImage from "@assets/images/its_gamify_banner.png";
import { TRANSLATION_NAME_SPACES } from "@i18n/config";
import { useLoginPage } from "@hooks/data/useLoginPage";
import { Controller } from "react-hook-form";
const LoginPage: React.FC = () => {
  const { t } = useCustomTranslation(TRANSLATION_NAME_SPACES.LOGIN);

  const {
    control,
    isLoading,
    handleSubmit,
    error,
    showPassword,
    handleTogglePasswordVisibility,
    rememberMe,
    handleRememberMe,
  } = useLoginPage();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        bgcolor: "#f5f7ff",
      }}
    >
      <Box
        sx={{
          borderRadius: "0 10px 10px 0",
          flex: { xs: 1, md: 0.5 },
          display: { xs: "none", md: "flex" },
          position: "relative",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Lớp overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box sx={{ maxWidth: 500, textAlign: "center", cursor: "pointer" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 3, fontWeight: 700, color: "#ffffff" }}
            >
              {t("welcomeBack")}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#f5f5f5" }}>
              {t("description")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Phần bên phải - form đăng nhập */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <img src={logoImage} alt="Its-Gamify Logo" height={100} />
              </Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                {t("title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("subtitle")}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LoginInput
                    label={t("form.email")}
                    name="email"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("form.emailPlaceholder")}
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LoginInput
                    label={t("form.password")}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("form.passwordPlaceholder")}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={rememberMe}
                      onChange={handleRememberMe}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("form.rememberMe")}
                    </Typography>
                  }
                />
                <Link href="/forgot-password" variant="body2" underline="hover">
                  {t("form.forgotPassword")}
                </Link>
              </Box>

              <LoginButton
                type="submit"
                variant="primary"
                disabled={isLoading}
                sx={{ mt: 2, mb: 3 }}
              >
                {isLoading ? t("form.loading") : t("form.loginButton")}
              </LoginButton>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
