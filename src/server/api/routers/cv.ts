import pdfParse from "pdf-parse";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const CVFormDataSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  skills: z.string(),
  experience: z.string(),
});

const ValidationRequestSchema = z.object({
  formData: CVFormDataSchema,
  pdfData: z.array(z.number()),
});

interface ValidationResult {
  success: boolean;
  message: string;
  mismatches?: string[];
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s@.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findInText(text: string, searchTerm: string): boolean {
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);

  if (normalizedSearch.includes("@")) {
    return normalizedText.includes(normalizedSearch);
  }

  const searchWords = normalizedSearch
    .split(" ")
    .filter((word) => word.length > 0);
  return searchWords.every((word) => normalizedText.includes(word));
}

function validateCVContent(
  formData: z.infer<typeof CVFormDataSchema>,
  pdfText: string,
): ValidationResult {
  const mismatches: string[] = [];

  if (!findInText(pdfText, formData.fullName)) {
    mismatches.push(`Full Name: "${formData.fullName}" not found in CV`);
  }

  if (!findInText(pdfText, formData.email)) {
    mismatches.push(`Email: "${formData.email}" not found in CV`);
  }

  const phoneDigits = formData.phone.replace(/\D/g, "");
  const pdfPhoneMatch = pdfText.match(/[\d\s\-\(\)\+]+/g);
  const phoneFound = pdfPhoneMatch?.some((match) => {
    const matchDigits = match.replace(/\D/g, "");
    return (
      matchDigits.includes(phoneDigits.slice(-7)) ||
      phoneDigits.includes(matchDigits.slice(-7))
    );
  });

  if (!phoneFound) {
    mismatches.push(`Phone: "${formData.phone}" not found in CV`);
  }

  const skillsList = formData.skills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const missingSkills = skillsList.filter(
    (skill) => !findInText(pdfText, skill),
  );
  if (missingSkills.length > 0) {
    mismatches.push(`Skills not found in CV: ${missingSkills.join(", ")}`);
  }

  const experienceWords = formData.experience
    .split(" ")
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "the",
          "and",
          "with",
          "that",
          "this",
          "have",
          "been",
          "work",
          "experience",
        ].includes(word.toLowerCase()),
    );

  const foundExperienceWords = experienceWords.filter((word) =>
    findInText(pdfText, word),
  );
  const experienceMatchRatio =
    foundExperienceWords.length / experienceWords.length;

  if (experienceMatchRatio < 0.3) {
    mismatches.push(
      `Experience description doesn't match CV content (${Math.round(experienceMatchRatio * 100)}% match)`,
    );
  }

  if (mismatches.length === 0) {
    return {
      success: true,
      message:
        "CV validation successful! All information matches the uploaded document.",
    };
  } else {
    return {
      success: false,
      message:
        "CV validation failed. Some information doesn't match the uploaded document.",
      mismatches,
    };
  }
}

export const cvRouter = createTRPCRouter({
  validateCV: publicProcedure
    .input(ValidationRequestSchema)
    .mutation(async ({ input }) => {
      try {
        const { formData, pdfData } = input;

        if (
          !Array.isArray(pdfData) ||
          !pdfData.every((n) => typeof n === "number")
        ) {
          console.error(
            "Invalid pdfData format:",
            typeof pdfData,
            Array.isArray(pdfData),
            pdfData?.slice?.(0, 10),
          );
          return {
            success: false,
            message: "Invalid PDF data format. Please upload a valid PDF file.",
          };
        }

        const buffer = Buffer.from(pdfData);
        const pdfResult = await pdfParse(buffer);
        const pdfText = pdfResult.text;

        if (!pdfText || pdfText.trim().length === 0) {
          return {
            success: false,
            message:
              "Could not extract text from the PDF. Please ensure the PDF is not image-based and try again.",
          };
        }

        return validateCVContent(formData, pdfText);
      } catch (error) {
        console.error("PDF parsing error:", error);
        return {
          success: false,
          message:
            "Error processing the PDF file. Please try again with a different file.",
        };
      }
    }),
});
