import { useState, useEffect } from "react";
import "./App.css";
import { z } from "zod";
import HomepageSchema, { Vibes } from "../forge/schema/startupnews";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ExtendedPostSchema = HomepageSchema.extend({
  posts: HomepageSchema.shape.posts.element.extend({
    link: z.string().url().describe("The link to the post"),
  }).array(),
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
      <div className="card">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Today in Hacker News</h2>
          <div className="vibe-tag" style={{ margin: "auto 16px", height: "fit-content", backgroundColor: "#0074D9", color: "#FFFFFF" }}>
            Vibe Breakdown: {homepage?.overallVibe ?? "Murky waters today..."}
          </div>
        </div>
        <div className="summary">
          <p>{homepage?.summary ?? "Some crazy stuff is happening... You should check it out."}</p>
        </div>
        <div className="built-with-forge" style={{ textAlign: "right", margin: "32px" }}>
          <p>
            Built with <a href="https://forge-ml.com" target="_blank" rel="noopener noreferrer">Forge</a>
          </p>
        </div>
        <div className="filter-sort" style={{ flexDirection: "row" }}>
          <label>
            Filter posts:
            <input
              type="text"
              placeholder="Filter posts"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
          </label>
          <label>
            Filter by Vibe:
            <select
              value={vibeFilter ?? ""}
              onChange={(e) => setVibeFilter(e.target.value as Vibes)}
              className="filter-input"
            >
              <option value="">All Vibes</option>
              {Vibes.options.map((vibe) => (
                <option key={vibe} value={vibe}>
                  {vibe}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort by:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="title">Title</option>
              <option value="innovative">Innovative</option>
              <option value="positive">Positive</option>
            </select>
          </label>
          <label>
            Sort order:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
        <div className="posts-container">
          {filteredPosts.map((post, index) => (
            <div key={index} className="post-row">
              <h2 className="post-title">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h2>
              <div className="post-details-grid">
                <div className="post-detail">
                  <span className="detail-title">Summary:</span>
                  <span className="post-summary">{post.summary}</span>
                </div>
                <div className="post-detail">
                  <span className="detail-title">Vibes:</span>
                  <div className="post-vibes">
                    {post.vibes.map((vibe, index) => (
                      <span key={index} className="vibe-tag">
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="post-detail">
                  <span className="detail-title">Innovative:</span>
                  <span className="post-innovative">{post.innovative}</span>
                </div>
                <div className="post-detail">
                  <span className="detail-title">Positive:</span>
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
