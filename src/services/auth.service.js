import { useMutation } from "react-query";
import { requestUnionAuth } from "./http-client";

const authService = {
  register: (data) => requestUnionAuth.post(`/login`, data),
};

export const UseAuth = (mutationSettings) => {
  return useMutation((data) => authService.register(data), mutationSettings);
};
