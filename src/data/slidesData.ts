import { CoverflowSlide } from "@/components/ui/coverflow-carousel";

const getWebsiteScreenshot = (url: string) =>
  `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=900&h=900`;

export interface MediaCardSlide extends CoverflowSlide {
  url: string;
  website: string;
  fallbackSrc?: string;
}

export const ALBUM_SLIDES: MediaCardSlide[] = [
  {
    src: getWebsiteScreenshot("https://www.northonsprmarketing.com/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://www.northonsprmarketing.com/",
    alt: "Northon's Media Official Website Thumbnail",
    title: "Northons's Media",
    subtitle: "northonsprmarketing.com",
    website: "northonsprmarketing.com",
    url: "https://www.northonsprmarketing.com/",
    color: "#a855f7",
    meta: [
      { label: "Platform", value: "PR & Marketing" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://www.globalipmagazine.com/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://www.globalipmagazine.com/",
    alt: "Global IP Magazine Official Website Thumbnail",
    title: "Global IP Magazine",
    subtitle: "globalipmagazine.com",
    website: "globalipmagazine.com",
    url: "https://www.globalipmagazine.com/",
    color: "#3b82f6",
    meta: [
      { label: "Platform", value: "Global Magazine" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://www.womensipworld.com/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://www.womensipworld.com/",
    alt: "Women's IP World Official Website Thumbnail",
    title: "Women's IP World",
    subtitle: "womensipworld.com",
    website: "womensipworld.com",
    url: "https://www.womensipworld.com/",
    color: "#ec4899",
    meta: [
      { label: "Platform", value: "Global Initiative" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://www.iptechnovation.com/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://www.iptechnovation.com/",
    alt: "IP Innovation and Technovation Website Thumbnail",
    title: "IP Innovation",
    subtitle: "iptechnovation.com",
    website: "iptechnovation.com",
    url: "https://www.iptechnovation.com/",
    color: "#06b6d4",
    meta: [
      { label: "Platform", value: "Technovation" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://www.womensipalliance.com/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://www.womensipalliance.com/",
    alt: "Women's IP Alliance Landing Website Thumbnail",
    title: "Women's IP Alliance Landing",
    subtitle: "womensipalliance.com",
    website: "womensipalliance.com",
    url: "https://www.womensipalliance.com/",
    color: "#8b5cf6",
    meta: [
      { label: "Platform", value: "Alliance Portal" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://wipanorthon.vercel.app/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://wipanorthon.vercel.app/",
    alt: "WIPA Platform Landing Website Thumbnail",
    title: "WIPA Platform Landing",
    subtitle: "wipanorthon.vercel.app",
    website: "wipanorthon.vercel.app",
    url: "https://wipanorthon.vercel.app/",
    color: "#10b981",
    meta: [
      { label: "Platform", value: "Web Platform" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://hieadminbucket.womensipalliance.com/"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://hieadminbucket.womensipalliance.com/",
    alt: "WIPA Platform Admin Management System Thumbnail",
    title: "WIPA Platform Admin",
    subtitle: "hieadminbucket.womensipalliance.com",
    website: "hieadminbucket.womensipalliance.com",
    url: "https://hieadminbucket.womensipalliance.com/",
    color: "#f59e0b",
    meta: [
      { label: "Platform", value: "Admin Console" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    src: getWebsiteScreenshot("https://www.womensipalliance.com/admin"),
    fallbackSrc: "https://image.thum.io/get/width/900/crop/900/https://www.womensipalliance.com/admin",
    alt: "Women's IP Alliance Landing Admin Thumbnail",
    title: "Women's IP Alliance Landing Admin",
    subtitle: "womensipalliance.com/admin",
    website: "womensipalliance.com/admin",
    url: "https://www.womensipalliance.com/admin",
    color: "#f43f5e",
    meta: [
      { label: "Platform", value: "Admin Portal" },
      { label: "Status", value: "Live" },
    ],
  },
];
