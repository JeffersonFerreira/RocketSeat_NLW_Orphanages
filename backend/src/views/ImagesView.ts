import Image from "../models/Image";

export default {
    render(image: Image) {
        return {
            id: image.id,
            url: `http://10.0.0.129:3333/uploads/${image.path}`
        }
    },

    renderMany(images: Image[]) {
        return images.map(o => this.render(o))
    }
}