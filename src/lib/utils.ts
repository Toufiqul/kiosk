import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const departmentOptions: Record<string, string> = {
  "2c44d30d-3b14-4a88-9c9f-4237e1e0d07a": "Computer Science & Engineering(CSE)",
  "23ac7036-0366-4106-b25a-f06fb57dc9d4": "Mechanical Engineering(ME)",
  "19789d51-0702-4456-95ea-1eee82c9919c": " Civil Engineering (CE)",
  "0ac51363-2f11-479a-96ca-816867631a21": "Science & Humanities (SH)",
  "4f09e2a4-4b73-46fc-a6a4-7c4a1721e2cd": "Nuclear Science & Engineering (NSE)",
  "704dc6b3-ba2e-4246-b3e2-150868552ced":
    "Petroleum & Mining Engineering (PME)",
  "8f67b8df-dc2a-44cf-857d-598f2ae6e19f": "Biomedical Engineering (BME)",
  "9817852b-c716-46ed-94ee-91dddaaadfd3": "Acthitecture",
  "a1dd277e-9549-4742-8491-ef2e406a59b7": "Aeronautical Engineering (AE)",
  "aca1d363-ec1b-4455-abda-fdfddd97f9ec":
    "Naval Architecture and Marine Engineering (NAME)",
  "c123fd99-bd75-438c-826e-d5f13f476711":
    "Industrial and Production Engineering(IPE)",
  "c1f9e63f-6af2-4523-ba5b-8240553412a7":
    "Environmental, Water Resources and Coastal Engineering (EWCE)",
  "c3fdcbde-771e-45cd-9414-b1c0b47a03ee":
    "Electrical, Electronic and Communication Engineering (EECE)",
};
