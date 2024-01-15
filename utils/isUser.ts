export const isUser = () => {
  const addr = window.localStorage.getItem("userAddress");
  if (addr) {
    return addr;
  }
  return false;
};
