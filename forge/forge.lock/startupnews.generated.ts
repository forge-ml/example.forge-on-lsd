import { z } from "zod";

export const Vibes = z.enum([
  "exciting",
  "innovative",
  "controversial",
  "educational",
  "groundbreaking",
  "thought-provoking",
  "uplifting",
  "alarming",
  "inspiring",
  "disruptive",
  "humorous",
  "informative",
  "motivational",
  "critical",
  "entertaining",
]);

const PostSchema = z.object({
  title: z.string().describe("The title of the post"),
  summary: z.string().min(10).describe("A brief summary of the post"),
  innovative: z
    .number()
    .int()
    .min(1, { message: "Score must be at least 1" })
    .max(10, { message: "Score must be at most 10" })
    .describe("A score (1-10) indicating how innovative the post is. Be discriminating."),
  positive: z
    .number()
    .int()
    .min(1, { message: "Score must be at least 1" })
    .max(10, { message: "Score must be at most 10" })
    .describe("A score (1-10) indicating how positive the post is. Be discriminating."),
  vibes: z.array(Vibes).describe("A vibe of the post"),
});

const HomepageSchema = z.object({
  posts: z.array(PostSchema).describe("The posts on the homepage"),
  summary: z.string().describe("Give a detailed summary of the posts that helps the user synthesize what's going on."),
  overallVibe: Vibes.describe("The overall vibes of the homepage"),
});

export default HomepageSchema;

export const config = {
  path: "startupnews",
  public: true,
  cache: "Common",
  contentType: "text",
  model: "gpt-4o-mini",
  provider: "openai",
};
