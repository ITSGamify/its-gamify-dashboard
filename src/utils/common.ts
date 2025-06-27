export const simulateEnterKeyDown = (callback?: () => void) => {
  if (!callback) {
    return;
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      callback();
    }
  };

  return handleKeyDown;
};
