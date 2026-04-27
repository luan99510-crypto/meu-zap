const express = require('express');
const { body, validationResult } = require('express-validator');
const { emailPattern, passwordPattern, codePattern } = require('../validation/patterns');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/cadastro', authLimiter,

  [
    body('username').notEmpty().withMessage('Nome de usuário é obrigatório'),
    body('email').matches(emailPattern).withMessage('E‑mail inválido'),
    body('senha').matches(passwordPattern).withMessage('Senha fraca')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  authController.cadastro
);
router.post('/verificar', authController.verificar);
router.post('/login', authLimiter,

  [
    body('email').matches(emailPattern).withMessage('E‑mail inválido'),
    body('senha').matches(passwordPattern).withMessage('Senha fraca')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  authController.login
);

module.exports = router;