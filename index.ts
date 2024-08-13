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
    const titles = await client.query(
      "SELECT a as title FROM https://news.ycombinator.com GROUP BY span.titleline;"
    );
    const q = prompt(
      titles.rows
        .sort((a, b) => (b.title > a.title ? -1 : 1))
        .map((row) => row.title)
        .join("\n")
    );

    const response = await forge.startupnews.query(q);

    res.json(response);

    client.end();
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching startup news");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
