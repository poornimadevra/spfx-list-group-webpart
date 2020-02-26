import { zipFiles } from "./zipFiles";
import SharePointService from "../services/SharePointService";

export const getZippedFiles = async (
  listName: string,
  items: string[]
): Promise<void> => {
  const res = await SharePointService.pnp_getLibraryFileBlobinBatch(
    listName,
    items
  );
  zipFiles(res);
};
