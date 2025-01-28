import { Router } from 'express'
import { createGadget, deleteGadget, destructGadget, getAllGadgets, updateGadget } from '../controllers/gadgets.controller.js'
import { loginCheck } from '../middlewares/authentication.middlware.js'
import { checkOwnership } from '../middlewares/authorization.middleware.js'

const router = Router()

router.route('/gadget')
    .get(getAllGadgets)
    .post(loginCheck, createGadget)

router.route('/gadget/:id')
    .put(loginCheck, checkOwnership, updateGadget)
    .delete(loginCheck, checkOwnership, deleteGadget)

router.route('/gadget/:id/destruct')
    .post(loginCheck, checkOwnership, destructGadget)


export default router
