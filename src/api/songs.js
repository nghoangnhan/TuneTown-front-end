/* eslint-disable no-unused-vars */
import UseCallApi from "../hooks/UseCallApi";
import { Base_URL } from "./config";

const { UseGet, UsePost, UseEdit } = UseCallApi();
import { auth } from "./config";

export const getSongListApi = (params) => {
  const url = `${Base_URL}/songs?page=1`;
  return UseGet({
    url,
    requiredToken: true,
    headers: auth.access_token,
    params,
  });
};
