const Detalle = require("./model");
const { DateTime } = require("lunox")

const ZONA_HORARIA = "America/La_Paz";
function addDetalleDB(detalle) {
    const newDetalle = new Detalle(detalle);
    return new Promise((resolve, reject) => {
        newDetalle
            .save()
            .then((det) =>
                resolve(
                    det
                        .populate("detalle.producto", "name precioVenta descuento")
                        .execPopulate()
                )
            )
            .catch((err) => reject(err));
    });
}
function getDetalleDB(id) {
    return Detalle.findById(id).populate(
        "detalle.producto",
        "name precioVenta descuento"
    );
}

// Reporte para obtener los productos mas vendidos de una sucursal con el margen de ganancia
function getProductosVendidosDB(idSucursal, fechaInicio, fechaFin) {

    // 1. Ajustar el inicio al primer milisegundo del día local (00:00:00.000) y convertir a Date de JS
    const inicioUTC = DateTime.fromISO(fechaInicio, { zone: ZONA_HORARIA })
        .startOf("day")
        .toJSDate();

    // 2. Ajustar el fin al último milisegundo del día local (23:59:59.999) y convertir a Date de JS
    const finUTC = DateTime.fromISO(fechaFin, { zone: ZONA_HORARIA })
        .endOf("day")
        .toJSDate();
    return Detalle.aggregate([
        {
            $unwind: "$detalle",
        },
        {
            $match: {
                "detalle.idSucursal": {
                    $eq: idSucursal,
                },
                fecha: {
                    $gte: inicioUTC,
                    $lte: finUTC,
                },

                venta: { $eq: true },
            },
        },
        {
            $group: {
                _id: "$detalle.producto",
                cantidad: { $sum: "$detalle.cantidad" },
                total: { $sum: "$detalle.subTotal" },
            },
        },
        {
            $lookup: {
                from: "productos",
                localField: "_id",
                foreignField: "_id",
                as: "_id",
            },
        },
        {
            $unwind: "$_id",
        },
        {
            $project: {
                "_id.detail": 0,
                "_id.fechaCaducidad": 0,
                "_id.category": 0,
                "_id.proveedor": 0,
                "_id.img": 0,
            },
        },
        {
            $sort: { cantidad: -1 },
        },
    ]);
}

// reportes de ventas y pedidos del dia y el total
function getVentasDiaDB(idSucursal, fechaHoyInicio, fechaHoyFin) {

    const inicioUTC = DateTime.fromISO(fechaHoyInicio, { zone: ZONA_HORARIA })
        .startOf("day")
        .toJSDate();

    const finUTC = DateTime.fromISO(fechaHoyFin, { zone: ZONA_HORARIA })
        .endOf("day")
        .toJSDate();
    return Detalle.aggregate([
        {
            $unwind: "$detalle",
        },
        {
            $match: {
                "detalle.idSucursal": {
                    $eq: idSucursal,
                },
                fecha: {
                    $gte: inicioUTC,
                    $lte: finUTC,
                },
                venta: { $eq: true },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%dT%H", date: "$fecha" } },
                total: { $sum: "$detalle.subTotal" },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
}

// reportes de la cantidad de ventas y pedidos del mes y el total
function getVentasMesDB(idSucursal, fechaIni, fechaFin) {
    const inicioUTC = DateTime.fromISO(fechaIni, { zone: ZONA_HORARIA })
        .startOf("day")
        .toJSDate();

    const finUTC = DateTime.fromISO(fechaFin, { zone: ZONA_HORARIA })
        .endOf("day")
        .toJSDate();
    return Detalle.aggregate([
        {
            $unwind: "$detalle",
        },
        {
            $match: {
                "detalle.idSucursal": {
                    $eq: idSucursal,
                },
                fecha: {
                    $gte: inicioUTC,
                    $lte: finUTC,
                },
                venta: { $eq: true },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$fecha" } },
                total: { $sum: "$detalle.subTotal" },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
}

// reportes de la cantidad de ventas y pedidos de cada sucursal
function getVentasSucursalesDB() {
    return Detalle.aggregate([
        {
            $unwind: "$detalle",
        },
        {
            $match: {
                venta: { $eq: true },
            },
        },
        {
            $lookup: {
                from: "sucursales",
                localField: "detalle.idSucursal",
                foreignField: "_id",
                as: "detalle.idSucursal",
            },
        },
        {
            $group: {
                _id: "$detalle.idSucursal.nombre",
                total: { $sum: "$detalle.subTotal" },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { count: -1 },
        },
        {
            $unwind: "$_id",
        },
    ]);
}

// Reporte para obtener todos los ingresos de una sucursal con rango de fechas
function getIngresosDB(idSucursal, fechaInicio, fechaFin) {
    const inicioUTC = DateTime.fromISO(fechaInicio, { zone: ZONA_HORARIA })
        .startOf("day")
        .toJSDate();

    const finUTC = DateTime.fromISO(fechaFin, { zone: ZONA_HORARIA })
        .endOf("day")
        .toJSDate();

    return Detalle.aggregate([
        {
            $unwind: "$detalle",
        },
        {
            $match: {
                "detalle.idSucursal": {
                    $eq: idSucursal,
                },
                fecha: {
                    $gte: inicioUTC,
                    $lte: finUTC,
                },

                venta: { $eq: true },
            },
        },
        {
            $lookup: {
                from: "productos",
                localField: "detalle.producto",
                foreignField: "_id",
                as: "detalle.producto",
            },
        },
        {
            $unwind: "$detalle.producto",
        },
        {
            $project: {
                "detalle.producto.detail": 0,
                "detalle.producto.fechaCaducidad": 0,
                "detalle.producto.category": 0,
                "detalle.producto.proveedor": 0,
                "detalle.producto.img": 0,
            },
        },
    ]);
}

module.exports = {
    addDetalleDB,
    getDetalleDB,
    getProductosVendidosDB,
    getVentasDiaDB,
    getVentasMesDB,
    getVentasSucursalesDB,
    getIngresosDB,
};
