import dayjs from "dayjs";
import animationData from "../assets/lottie-json.json";
export function getAvatarname(input: string): string {
  const words = input
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return "";
  }

  const firstInitial = words[0][0].toUpperCase();
  const lastInitial = words[words.length - 1][0].toUpperCase();

  return firstInitial + lastInitial;
}

export const assignAvaatr = (gender: string) => `/profileAvatar/${gender}.png`;

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};

export const getDuration = (
  start: Date | string,
  end: Date | string
): string => {
  const diffInSeconds = dayjs(end).diff(dayjs(start), "seconds");

  const days = Math.floor(diffInSeconds / (60 * 60 * 24));
  const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
  const seconds = diffInSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 && parts.length === 0)
    parts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);

  return parts.join(" ");
};
