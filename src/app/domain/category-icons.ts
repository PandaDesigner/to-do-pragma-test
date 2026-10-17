import {
  airplaneOutline,
  barbellOutline,
  bookOutline,
  briefcaseOutline,
  cartOutline,
  cashOutline,
  heartOutline,
  homeOutline,
  musicalNotesOutline,
  pawOutline,
  restaurantOutline,
  starOutline,
} from 'ionicons/icons';

export type CategoryIconKey =
  | 'cart'
  | 'home'
  | 'briefcase'
  | 'heart'
  | 'book'
  | 'plane'
  | 'fork'
  | 'muscle'
  | 'music'
  | 'paw'
  | 'money'
  | 'star';

export const CATEGORY_ICONS: readonly {
  key: CategoryIconKey;
  label: string;
  icon: string;
}[] = [
  { key: 'cart', label: 'Cart', icon: cartOutline },
  { key: 'home', label: 'Home', icon: homeOutline },
  { key: 'briefcase', label: 'Briefcase', icon: briefcaseOutline },
  { key: 'heart', label: 'Heart', icon: heartOutline },
  { key: 'book', label: 'Book', icon: bookOutline },
  { key: 'plane', label: 'Plane', icon: airplaneOutline },
  { key: 'fork', label: 'Dining', icon: restaurantOutline },
  { key: 'muscle', label: 'Fitness', icon: barbellOutline },
  { key: 'music', label: 'Music', icon: musicalNotesOutline },
  { key: 'paw', label: 'Pets', icon: pawOutline },
  { key: 'money', label: 'Money', icon: cashOutline },
  { key: 'star', label: 'Star', icon: starOutline },
];

export function resolveCategoryIcon(key: string): string {
  const match = CATEGORY_ICONS.find((entry) => entry.key === key);
  return match?.icon ?? CATEGORY_ICONS[0].icon;
}