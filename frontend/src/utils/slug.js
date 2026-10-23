// Turns a task title into a URL slug: "Buy oat milk, 2L!" -> "buy-oat-milk-2l"
// Used by Practical 18, Step 3 to build readable URLs such as
// /todos/12/buy-oat-milk
export const slugify = (text) =>
  (text || "")
    .toString()
    .normalize("NFKD")               // split accented characters
    .replace(/[\u0300-\u036f]/g, "") // drop the accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")    // keep letters, digits, spaces and dashes
    .replace(/[\s_-]+/g, "-")        // collapse separators into a single dash
    .replace(/^-+|-+$/g, "")         // trim leading / trailing dashes
    .slice(0, 60);                   // keep URLs short
