export let navigate = () => {};

export const setNavigate = (fn: () => void) => {
  navigate = fn;
};
