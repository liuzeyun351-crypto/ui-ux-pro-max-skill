import Image from "next/image";
import { PortraitArt, BannerArt } from "./PortraitArt";
import { getPhoto } from "@/lib/photo";

/**
 * The single decision point for talent imagery.
 *
 * Renders a real, freely-licensed photograph when `npm run fetch:images` has
 * supplied one; otherwise falls back to the generated portrait so the interface
 * is never broken by a missing asset. Every celebrity image in the app goes
 * through here.
 */
export interface TalentImageSubject {
  name: string;
  accentHue: number;
  photo?: string | null;
}

export function TalentImage({
  celebrity,
  variant = 0,
  wide = false,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority,
}: {
  celebrity: TalentImageSubject;
  /** art fallback seed — ignored when a photograph exists */
  variant?: number;
  /** use the 16:9 crop instead of the 3:4 portrait */
  wide?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const photo = getPhoto(celebrity);

  if (!photo) {
    return wide ? (
      <BannerArt title={celebrity.name} hue={celebrity.accentHue} className={className} />
    ) : (
      <PortraitArt
        name={celebrity.name}
        hue={celebrity.accentHue}
        variant={variant}
        className={className}
      />
    );
  }

  const src = wide ? (photo.wide ?? photo.portrait) : photo.portrait;

  return (
    <Image
      src={src}
      alt={`Photograph of ${celebrity.name}`}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
      {...(photo.blur ? { placeholder: "blur" as const, blurDataURL: photo.blur } : {})}
    />
  );
}

/**
 * Article hero art. Uses the tagged celebrity's wide photograph when one exists,
 * otherwise the generated banner keyed to the article's hue.
 */
export function ArticleImage({
  title,
  hue,
  celebrity,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
}: {
  title: string;
  hue: number;
  celebrity?: TalentImageSubject | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const photo = celebrity ? getPhoto(celebrity) : null;
  if (!photo?.wide) {
    return <BannerArt title={title} hue={hue} className={className} />;
  }
  return (
    <Image
      src={photo.wide}
      alt={`Photograph of ${celebrity!.name}`}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
      {...(photo.blur ? { placeholder: "blur" as const, blurDataURL: photo.blur } : {})}
    />
  );
}
