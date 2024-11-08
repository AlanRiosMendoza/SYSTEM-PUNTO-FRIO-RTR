import VentaSchema from "../models/Venta"

export const crearVenta = async (req, res) => {
    const { cliente_id, total, metodo_pago } = req.body
    const venta = new VentaSchema({ cliente_id, total, metodo_pago })
    try {
        await venta.save()
        res.status(201).json(venta)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const obtenerVentas = async (req, res) => {
    try {
        const ventas = await VentaSchema.find()
        res.status(200).json(ventas)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const obtenerVenta = async (req, res) => {
    const { id } = req.params
    try {
        const venta = await VentaSchema.findById(id)
        res.status(200).json(venta)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}