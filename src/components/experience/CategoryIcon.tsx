import React from 'react';
import { BinocularsIcon, MountainSnowIcon, UtensilsIcon, TreesIcon, WineIcon, CameraIcon, Building2Icon, TentIcon, CompassIcon } from 'lucide-react';

const map: Record<string, typeof CompassIcon> = {
  'wildlife-safari': BinocularsIcon,
  adventure: MountainSnowIcon,
  'food-culture': UtensilsIcon,
  nature: TreesIcon,
  'wine-culinary': WineIcon,
  photography: CameraIcon,
  city: Building2Icon,
  outdoor: TentIcon
};

export function CategoryIcon({ category, className }: {category: string;className?: string;}) {
  const Icon = map[category] ?? CompassIcon;
  return <Icon className={className} aria-hidden />;
}