import { ApiPackage, Package } from "../types";

export const transformApiPackage = (apiPkg: ApiPackage): Package => {
  const getIconFromName = (name: string): Package["icon"] => {
    if (name.toLowerCase().includes("starter")) return "coins";
    if (name.toLowerCase().includes("silver")) return "sparkles";
    if (name.toLowerCase().includes("gold")) return "zap";
    if (name.toLowerCase().includes("diamond")) return "crown";
    return "coins";
  };

  return {
    id: apiPkg.id.toString(),
    name: apiPkg.name,
    points: apiPkg.points,
    price: apiPkg.amount,
    tag: apiPkg.tag,
    icon: getIconFromName(apiPkg.name),
    popular: apiPkg.is_popular,
    bonus: apiPkg.bonus || 0,
    photo: {
      thumbnail_url: apiPkg.photo.thumbnail_url || "",
      url: apiPkg.photo.url || "",
    },
    weight: apiPkg.weight,
    bonusPoints: 0
  };
};

export const getTotalPoints = (pkg: Package) => {
  if (pkg.bonus && pkg.bonus > 0) {
    return pkg.points + Math.floor(pkg.points * (pkg.bonus / 100));
  }
  return pkg.points;
};

export const getGradient = (weight: number) => {
  switch (weight) {
    case 1:
      return "from-gray-400 via-gray-500 to-gray-600";
    case 2:
      return "from-blue-400 via-blue-500 to-blue-600";
    case 3:
      return "from-yellow-400 via-orange-500 to-orange-600";
    case 4:
      return "from-purple-500 via-purple-600 to-pink-600";
    default:
      return "from-purple-600 via-blue-600 to-pink-600";
  }
};
