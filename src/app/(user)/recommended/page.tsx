import type { Metadata } from "next";
import { RecommendedView } from "./recommended-view";

export const metadata: Metadata = {
  title: "Recommended Adhkar",
  description: "Adhkar recommended for this time of day",
};

export default function RecommendedPage() {
  return <RecommendedView />;
}