import express from "express";
import { Client } from "pg";
import forge from "./forge/client";
import cors from "cors";

const app = express();
app.use(cors());
const port = 8001;

const prompt = (posts: string) => {
  return `
  The hacker news posts for today are:
  ${posts}
  
  List all posts. What's going on in the world of startups?
  `;
};

app.get("/startupnews", async (_req, res) => {
  const client = new Client({
    connectionString: "https://lsd.so",
  });
  client.connect().then(() => {
    console.log("Connected to database");
  });
  try {
    const pgResults = await client.query(
      "SELECT a as title, a@href as link FROM https://news.ycombinator.com GROUP BY span.titleline;"
    );
    const titles = pgResults.rows
      .sort((a, b) => (b.title > a.title ? -1 : 1))
      .map((row) => row.title)
      .join("\n")
    const q = prompt(titles);

    const response = await forge.startupnews.query(q);

    const postsWithLinks = response.posts.map((post) => ({
      ...post,
      link: pgResults.rows.find((row) => row.title === post.title)?.link,
    }));

    res.json({ ...response, posts: postsWithLinks });

    client.end();
  } catch (e) {
    res.status(500).send("Error fetching startup news");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
