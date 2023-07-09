import axios from "axios";
import iconv from "iconv-lite";

export const getInvestmentTrend = async (url: string) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return iconv.decode(response.data, "EUC-KR").toString();
};
