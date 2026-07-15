import {
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BookHeart,
  Heart,
  Star,
  Moon,
  MoonStar,
  Sun,
  Sunrise,
  SunMedium,
  SunMoon,
  Compass,
  Building2,
  Landmark,
  Droplets,
  Bell,
  BellRing,
  Hand,
  HandHeart,
  Sparkles,
  Cloud,
  CloudMoon,
  Crown,
  Flame,
  Lightbulb,
  Medal,
  ScrollText,
  Sprout,
  Flower,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ponytail: curated minimalist pack, not exhaustive — add entries when a category needs a new symbol
// Islamic-themed additions: lucide has no mosque/prayer icons, so names map to dhikr metaphors (BookOpenCheck = post-prayer dhikr, SunMoon = day&night worship, CloudMoon = Tahajjud, etc.)
export const CATEGORY_ICONS = {
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BookHeart,
  Heart,
  Star,
  Moon,
  MoonStar,
  Sun,
  Sunrise,
  SunMedium,
  SunMoon,
  Compass,
  Building2,
  Landmark,
  Droplets,
  Bell,
  BellRing,
  Hand,
  HandHeart,
  Sparkles,
  Cloud,
  CloudMoon,
  Crown,
  Flame,
  Lightbulb,
  Medal,
  ScrollText,
  Sprout,
  Flower,
} as const;

export type CategoryIconName = keyof typeof CATEGORY_ICONS;

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS) as CategoryIconName[];

const DEFAULT_ICON: CategoryIconName = "BookOpen";

interface CategoryIconProps {
  name?: string | null;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon =
    (name && (CATEGORY_ICONS as Record<string, LucideIcon>)[name]) ||
    CATEGORY_ICONS[DEFAULT_ICON];
  return <Icon className={cn("h-5 w-5", className)} />;
}