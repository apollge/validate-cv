"use client";

import { useState } from "react";

export function LatestPost() {
  const [name, setName] = useState("");

  return (
    <div className="w-full max-w-xs">
      <p>You have no posts yet.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
