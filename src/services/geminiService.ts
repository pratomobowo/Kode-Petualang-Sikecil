import { Command, LevelConfig, Position } from "../types";

export const getRoboHint = async (
  level: LevelConfig,
  currentCommands: Command[],
  failureReason: string,
  robotPosition: Position
): Promise<string> => {
  // Static hints based on failure reason
  if (failureReason.includes("batu")) {
    return "Awas ada batu! Coba cari jalan memutar ya.";
  }
  if (failureReason.includes("batas")) {
    return "Hati-hati, jangan sampai keluar jalur!";
  }
  return "Jangan menyerah! Coba cek lagi arah panahmu.";
};

export const getWinMessage = async (starsCollected: number): Promise<string> => {
  if (starsCollected === 3) {
    return "Luar biasa! 3 Bintang! 🌟🌟🌟";
  }
  if (starsCollected > 0) {
    return "Hebat! Kamu berhasil! 🎉";
  }
  return "Hore! Kamu menang! 🎈";
}
