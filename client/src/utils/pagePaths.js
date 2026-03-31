export const resolvePagePath = (slug) => {
  if (slug === "home") return "/";
  if (slug === "contacts") return "/contacts";
  if (slug === "gallery") return "/gallery";
  if (slug === "feedback") return "/feedback";
  return `/page/${slug}`;
};
