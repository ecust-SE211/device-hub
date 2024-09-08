import { initCategoryInfo } from "./category";

let initialized: boolean = false;

const isInitialized = () => {
  return initialized;
};
const init = async () => {
  await Promise.all([initCategoryInfo()]);
  initialized = true;
};
export { isInitialized, init };
