const { Notificacion } = require('../models');

// Función para crear una nueva notificación
exports.crearNotificacion = async (req, res) => {
  const { usuario_id, mensaje } = req.body;

  try {
    const nuevaNotificacion = await Notificacion.create({
      usuario_id,
      mensaje,
    });

    res.status(201).json(nuevaNotificacion);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear notificación', error });
  }
};

// Función para buscar notificaciones
exports.buscarNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({ where: { usuario_id: req.usuario.id } });
    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar notificaciones', error });
  }
};

// Función para marcar una notificación como leída
exports.marcarNotificacionLeida = async (req, res) => {
  const { id } = req.params;

  try {
    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ msg: 'Notificación no encontrada' });
    }

    notificacion.leida = true;
    await notificacion.save();
    res.status(200).json(notificacion);
  } catch (error) {
    res.status(500).json({ msg: 'Error al marcar notificación como leída', error });
  }
};