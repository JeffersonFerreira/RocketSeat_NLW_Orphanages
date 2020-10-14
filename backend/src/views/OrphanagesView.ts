import Orphanage from "../models/Orphanage";
import ImagesView from "./ImagesView";

export default {
    render(orphanage: Orphanage) {
        const { images, ...rest } = orphanage
        return { ...rest, images: ImagesView.renderMany(images) }
    },

    renderMany(orphanages: Orphanage[]) {
        return orphanages.map(o => this.render(o))
    }
}