import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Orphanage from "../models/Orphanage";
import OrphanagesView from "../views/OrphanagesView";
import * as Yup from 'yup'

export default {

    async index(req: Request, res: Response) {
        const orphanageRepo = getRepository(Orphanage)
        const allOrphanages = await orphanageRepo.find({
            relations: [ 'images' ]
        })

        return res.json(OrphanagesView.renderMany(allOrphanages))
    },

    async show(req: Request, res: Response) {
        const { id } = req.params

        const orphanageRepo = getRepository(Orphanage)
        const orphanage = await orphanageRepo.findOneOrFail(id, {
            relations: [ 'images' ]
        })

        return res.json(OrphanagesView.render(orphanage))
    },

    async create(req: Request, res: Response) {
        const requestImageFiles = req.files as Express.Multer.File[];
        const imagePaths = requestImageFiles.map(img => ( { path: img.filename } ))

        const data: Orphanage = { ...req.body, images: imagePaths }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            )
        })

        await schema.validate(data, {
            abortEarly: false
        })

        const orphanageRepo = getRepository(Orphanage)

        const newOrphanage = orphanageRepo.create(data);
        await orphanageRepo.save(newOrphanage)

        return res.status(201).json(OrphanagesView.render(newOrphanage))
    }
}