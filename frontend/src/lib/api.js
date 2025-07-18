import { apiClient } from "./axios";
import { GET_USER_ROUTE } from "./routes";

export async function getUserName({ userId }) {
  try {
    const res = await apiClient.get(`${GET_USER_ROUTE}/${userId}`);
    //console.log(res.data.name);
    return res.data.name;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}
