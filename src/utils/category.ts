import { get } from "@/libs";
import c001 from "@/static/category/C001.jpg";
import c002 from "@/static/category/C002.jpg";
import c003 from "@/static/category/C003.jpg";
import c004 from "@/static/category/C004.jpg";
import c005 from "@/static/category/C005.jpg";
import c006 from "@/static/category/C006.jpg";
import c007 from "@/static/category/C007.jpg";
import blank from "@/static/test.jpg";
import { StaticImageData } from "next/image";

const imageList: Record<string, StaticImageData> = {
  C001: c001,
  C002: c002,
  C003: c003,
  C004: c004,
  C005: c005,
  C006: c006,
  C007: c007,
};

export interface GetCategoryInfoResponse {
  id: string;
  name: string;
  description: string;
  image?: StaticImageData;
}

export type GetCategoryInfoListResponse = Array<GetCategoryInfoResponse>;
export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  image: StaticImageData;
}

export type CategoryInfoList = Map<string, CategoryInfo>;

const categoryInfoList: CategoryInfoList = new Map();
const initCategoryInfo = async () => {
  const res = await get<GetCategoryInfoListResponse>(
    "/category/getCategoryList"
  );
  const { code, msg } = res;
  console.log(res);
  if (code !== "200") {
    throw new Error(`Code :${code}\n${msg}`);
  }
  categoryInfoList.clear();
  res.data!.forEach((info, index) => {
    info.image = imageList[info.id] ?? blank;
    categoryInfoList.set(info.id, info as CategoryInfo);
  });
};

export { categoryInfoList as categoryInfoMap, initCategoryInfo };
