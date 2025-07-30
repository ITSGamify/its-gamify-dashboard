import ToastContent from "@components/ui/atoms/Toast";
import ChallengeConfirmStep from "@components/ui/molecules/ChallengeConfirmStep";
import ChallengeInforForm from "@components/ui/molecules/ChallengeInforForm";
import { PATH } from "@constants/path";
import {
  CONFIRMING_DETAILS_STEP,
  INITIAL_CREATE_STEP,
} from "@constants/tournament";
import { ChallengeStepFormProps } from "@interfaces/api/challenge";
import {
  RequestChallengeParams,
  RequestUpdateChallengeParams,
  useCreateChallenge,
  useGetChallengeDetail,
  useUpdateChallenge,
} from "@services/challenge";
import { getRoute } from "@utils/route";
import { JSX, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const TOURNAMENT_KEY = "TOURNAMENT_KEY";

export const useChallengeRequestForm = (
  challengeId?: string,
  editMode?: boolean
) => {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const paramsCurrentStep = searchParams.get("step") || 0;
  const [activeStep, setActiveStep] = useState(+paramsCurrentStep);

  const [tempData, setTempData] =
    useState<Partial<RequestChallengeParams> | null>(() => {
      const storedData = sessionStorage.getItem(TOURNAMENT_KEY);
      return storedData ? JSON.parse(storedData) : null;
    });

  useEffect(() => {
    if (tempData) {
      sessionStorage.setItem(TOURNAMENT_KEY, JSON.stringify(tempData));
    } else {
      sessionStorage.removeItem(TOURNAMENT_KEY);
    }
  }, [tempData]);

  useEffect(() => {
    setActiveStep(+paramsCurrentStep);
  }, [paramsCurrentStep]);

  const handleBackToList = () => {
    setTempData(null);
    navigation(PATH.TOURNAMENT);
  };

  const {
    data: challengeDetail,
    refetch,
    isFetching,
  } = useGetChallengeDetail(challengeId || "");

  useEffect(() => {
    if (challengeId) {
      refetch();
    }
    if (editMode && challengeDetail && !tempData) {
      setTempData(challengeDetail);
    }
  }, [activeStep, challengeId, refetch, editMode, challengeDetail, tempData]);

  const { mutateAsync: createChallenge, isPending: isCreating } =
    useCreateChallenge();

  const { mutateAsync: updateChallenge, isPending: isUpdating } =
    useUpdateChallenge();

  const isLoading = isCreating || isUpdating;

  const handleBack = () => {
    if (activeStep === INITIAL_CREATE_STEP) {
      return handleBackToList();
    }

    const prevStep = activeStep - 1;
    setActiveStep(prevStep);

    const route = challengeId
      ? getRoute(PATH.TOURNAMENT_EDIT, {
          tournamentId: challengeDetail?.id || challengeId,
        })
      : PATH.TOURNAMENT_CREATE; // Giả sử path create nếu không có ID

    navigation(route + "?step=" + prevStep, { replace: true });
  };

  const handleNextStep = async <T,>(formData: T) => {
    if (activeStep === INITIAL_CREATE_STEP) {
      setTempData((prev) => ({
        ...prev,
        ...(formData as Partial<RequestChallengeParams>),
      }));

      const nextStep = activeStep + 1;
      setActiveStep(nextStep);

      const route = challengeId
        ? getRoute(PATH.TOURNAMENT_EDIT, { tournamentId: challengeId })
        : PATH.TOURNAMENT_CREATE; // Giả sử path cho create

      navigation(route + "?step=" + nextStep, { replace: true });
    }
  };

  const handleConfirm = async () => {
    if (editMode) {
      await updateChallenge(
        {
          ...(formData as RequestUpdateChallengeParams),
          ...(challengeId ? { id: challengeId } : {}),
        },
        {
          onSuccess: () => {
            toast.success(ToastContent, {
              data: {
                message: "Cập nhật thành công!",
              },
            });
            sessionStorage.removeItem(TOURNAMENT_KEY);
            return navigation(PATH.TOURNAMENT);
          },
        }
      );
    } else {
      await createChallenge(
        {
          ...(formData as RequestChallengeParams),
        },
        {
          onSuccess: () => {
            toast.success(ToastContent, {
              data: {
                message: "Tạo thử thách thành công!",
              },
            });
            sessionStorage.removeItem(TOURNAMENT_KEY);
            return navigation(PATH.TOURNAMENT);
          },
        }
      );
    }
  };

  const stepForms: Record<
    number,
    (props: ChallengeStepFormProps) => JSX.Element
  > = {
    [INITIAL_CREATE_STEP]: ChallengeInforForm,
    [CONFIRMING_DETAILS_STEP]: ChallengeConfirmStep,
  };

  const ActiveStepForm = stepForms[activeStep];

  const formData =
    tempData ||
    (activeStep === CONFIRMING_DETAILS_STEP ? null : challengeDetail);

  return {
    challengeDetail: challengeDetail || null,
    ActiveStepForm,
    handleNextStep,
    handleBackToList,
    activeStep,
    handleBack,
    isLoadingForm: isFetching,
    isLoading,
    formData,
    handleConfirm,
  };
};
