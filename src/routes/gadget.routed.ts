import { create } from 'domain'
import { Router } from 'express'

const router = Router()

//Gadget CRUD Routes

router.get("/getGadgets", getAllGadgets)

router.post("createGadget", createGadget)

router.patch("updateGadget", updateGadget)

router.delete("deleteGadget", deleteGadget)


