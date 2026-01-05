import { Bundle } from "../../data/gameData";

export const getIconFromCode = (
  code: string
): "coins" | "sparkles" | "zap" | "crown" => {
  if (code.includes("starter")) return "coins";
  if (code.includes("silver")) return "sparkles";
  if (code.includes("gold")) return "zap";
  return "crown";
};

export const getGradientFromWeight = (weight: number): string => {
  switch (weight) {
    case 1:
      return "from-slate-700 to-slate-900";
    case 2:
      return "from-blue-600 to-purple-600";
    case 3:
      return "from-orange-500 to-pink-600";
    default:
      return "from-purple-600 to-pink-600";
  }
};

export const transformApiBundle = (apiBundle: any): Bundle => {
  const totalValue = parseFloat(apiBundle.package_details.total_value);
  const pointsCost = Math.round(totalValue * 100);

  return {
    id: apiBundle.code,
    code: apiBundle.code,
    name: apiBundle.name,
    pointsCost,
    dailyPoints: parseInt(apiBundle.package_details.daily_points),
    dailyUsdt: parseFloat(apiBundle.package_details.daily_usdt),
    duration: parseInt(apiBundle.package_details.duration_days),
    totalValue,
    icon: getIconFromCode(apiBundle.code),
    gradient: getGradientFromWeight(apiBundle.weight),
    popular: apiBundle.is_popular,
    tag: apiBundle.tag || undefined,
    photo: apiBundle.photo.url,
    weight: apiBundle.weight,
  };
};
