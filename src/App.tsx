import { useState, useEffect } from "react";
import "./App.css";
import { z } from "zod";
import HomepageSchema, { Vibes } from "../forge/schema/startupnews";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ExtendedPostSchema = HomepageSchema.extend({
  posts: HomepageSchema.shape.posts.element
    .extend({
      link: z.string().url().describe("The link to the post"),
    })
    .array(),
});

type Homepage = z.infer<typeof ExtendedPostSchema>;
type Vibes = z.infer<typeof Vibes>;

function App() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [filter, setFilter] = useState("");
  const [vibeFilter, setVibeFilter] = useState<Vibes | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    fetch(`${SERVER_URL}/startupnews`)
      .then((response) => response.json())
      .then((data) => setHomepage(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const filteredPosts = homepage?.posts
    ?.filter(
      (post) =>
        post.title.toLowerCase().includes(filter.toLowerCase()) &&
        (vibeFilter ? post.vibes.includes(vibeFilter) : true)
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "innovative") {
        return sortOrder === "asc"
          ? a.innovative - b.innovative
          : b.innovative - a.innovative;
      } else {
        return sortOrder === "asc"
          ? a.positive - b.positive
          : b.positive - a.positive;
      }
    });

  if (!filteredPosts) return <div>Loading...</div>;
  return (
    <>
      <div
        className="card"
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          padding: "20px",
        }}
      >
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Today in Hacker News</h2>
          <div
            className="vibe-tag"
            style={{ margin: "10px 0", padding: "5px 10px" }}
          >
            Vibe Breakdown: {homepage?.overallVibe ?? "Murky waters today..."}
          </div>
        </div>
        <div
          className="summary"
          style={{ margin: "20px 0", textAlign: "center" }}
        >
          <p>
            {homepage?.summary ??
              "Some crazy stuff is happening... You should check it out."}
          </p>
        </div>
        <div
          className="built-with-forge"
          style={{ textAlign: "right", margin: "20px 0" }}
        >
          <p>
            Built with{" "}
            <a
              href="https://forge-ml.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Forge
            </a>{" "}
            and{" "}
            <a href="https://lsd.so/" target="_blank" rel="noopener noreferrer">
              LSD
            </a>
          </p>
        </div>
        <div
          className="filter-sort"
          style={{
            display: "flex",
            gap: "10px",
            margin: "20px 0",
          }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            Filter posts:
            <input
              type="text"
              placeholder="Filter posts"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
              style={{ padding: "8px" }}
            />
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            Filter by Vibe:
            <select
              value={vibeFilter ?? ""}
              onChange={(e) => setVibeFilter(e.target.value as Vibes)}
              className="filter-input"
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">All Vibes</option>
              {Vibes.options.map((vibe) => (
                <option key={vibe} value={vibe}>
                  {vibe}
                </option>
              ))}
            </select>
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            Sort by:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="title">Title</option>
              <option value="innovative">Innovative</option>
              <option value="positive">Positive</option>
            </select>
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            Sort order:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
        <div
          className="posts-container"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {filteredPosts.map((post, index) => (
            <div
              key={index}
              className="post-row"
              style={{
                padding: "15px",
                backgroundColor: "#2e2e2e",
                borderRadius: "8px",
              }}
            >
              <h2 className="post-title" style={{ marginBottom: "10px" }}>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: "break-word" }}
                >
                  {post.title}
                </a>
              </h2>
              <div
                className="post-details-grid"
                style={{
                  gap: "15px",
                }}
              >
                <div className="post-detail">
                  <span
                    className="detail-title"
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Summary:
                  </span>
                  <span
                    className="post-summary"
                    style={{ display: "block", wordBreak: "break-word" }}
                  >
                    {post.summary}
                  </span>
                </div>
                <div className="post-vibes">
                  <span
                    className="detail-title"
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Vibes:
                  </span>
                  <div
                    className="post-vibes"
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                  >
                    {post.vibes.map((vibe, index) => (
                      <span
                        key={index}
                        className="vibe-tag"
                        style={{ padding: "2px 5px", borderRadius: "3px" }}
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="post-score">
                  <span
                    className="detail-title"
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Innovative:
                  </span>
                  <span className="post-innovative">{post.innovative}</span>
                </div>
                <div className="post-score">
                  <span
                    className="detail-title"
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Positive:
                  </span>
                  <span className="post-positive">{post.positive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
