import { useState, useEffect } from "react";
import "./App.css";
import { z } from "zod";
import HomepageSchema, { Vibes } from "../forge/schema/startupnews";

const SERVER_URL = "http://localhost:8001";

type Posts = z.infer<typeof HomepageSchema>;

function App() {
  const [homepage, setHomepage] = useState<Posts | null>(null);
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
              value={vibeFilter}
              onChange={(e) => setVibeFilter(e.target.value)}
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
              <h2 className="post-title">{post.title}</h2>
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
