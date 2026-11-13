import { withInstall } from '../../utils/install'
import Carousel from './carousel.vue'
import CarouselItem from './carousel-item.vue'

export const MomoCarousel = withInstall(Carousel)
export const MomoCarouselItem = withInstall(CarouselItem)

export default { MomoCarousel, MomoCarouselItem }
export type { CarouselProps } from './carousel.vue'
