import { api } from "./api";

type UpdateUserPayload = {
  shirt_size?: string;
  pants_size?: string;
  shoe_size?: string;
  ring_size?: string;
  preferred_color?: string;
};

export async function updateUser(payload: UpdateUserPayload) {
  const response = await api.put("/user/update", payload);
  return response.data;
}
