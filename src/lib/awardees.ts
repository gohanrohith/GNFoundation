import awardeesData from './awardees.json';
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type Awardee = {
  name: string;
  award: string;
  imageId: string;
  year: number;
  school: string;
  class: string;
  image?: ImagePlaceholder;
};

// Combine awardee data with image data
export const allAwardees: Awardee[] = awardeesData.awardees.map(awardee => ({
  ...awardee,
  image: PlaceHolderImages.find(p => p.id === awardee.imageId),
}));
