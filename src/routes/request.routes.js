const express = require('express');
const router = express.Router();

const controller = require('../controllers/request.controller');

const authenticate = require('../middleware/authenticate.middleware');
const authorizePermission = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');

const {
  createRequestSchema,
  updateRequestSchema
} = require('../validators/request.validator');

/* =====================================================
   CREAR
===================================================== */
router.post(
  '/',
  authenticate,
  authorizePermission('requests.create'),
  validate(createRequestSchema),
  controller.create
);

/* =====================================================
   VER TODAS (ADMIN PERMISO)
===================================================== */
router.get(
  '/',
  authenticate,
  authorizePermission('requests.read.all'),
  controller.getAll
);

/* =====================================================
   VER MIS SOLICITUDES
===================================================== */
router.get(
  '/mine',
  authenticate,
  authorizePermission('requests.read'),
  controller.getMine
);

/* =====================================================
   VER UNA
===================================================== */
router.get(
  '/:id',
  authenticate,
  authorizePermission('requests.read'),
  controller.getOne
);

/* =====================================================
   ACTUALIZAR
===================================================== */
router.put(
  '/:id',
  authenticate,
  authorizePermission('requests.update'),
  validate(updateRequestSchema),
  controller.update
);

/* =====================================================
   ELIMINAR
===================================================== */
router.delete(
  '/:id',
  authenticate,
  authorizePermission('requests.delete'),
  controller.remove
);

module.exports = router;
