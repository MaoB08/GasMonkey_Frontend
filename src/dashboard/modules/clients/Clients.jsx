import React, { useState, useEffect } from "react";
import clientsService from "./clientsService";
import {
    Search,
    UserPlus,
    Edit,
    Trash2,
    Users,
} from "lucide-react";
import Swal from "sweetalert2";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [cities, setCities] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [clientsPorPagina] = useState(5);
    const [clientEditando, setClientEditando] = useState(null);
    const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

    const [nuevoClient, setNuevoClient] = useState({
        document_type: "",
        document_number: "",
        first_name: "",
        middle_name: "",
        last_name1: "",
        last_name2: "",
        address: "",
        phone: "",
        email: "",
        city_id: "",
    });

    useEffect(() => {
        cargarClients();
        cargarCities();
    }, []);

    async function cargarClients() {
        try {
            const data = await clientsService.getAllClients();
            setClients(data);
        } catch (error) {
            console.error("❌ Error al cargar clientes:", error);
            Swal.fire("Error", "No se pudieron cargar los clientes", "error");
        }
    }

    async function cargarCities() {
        try {
            const data = await clientsService.getAllCities();
            setCities(data);
        } catch (error) {
            console.error("❌ Error al cargar ciudades:", error);
        }
    }

    const clientsFiltrados = clients.filter((c) => {
        const fullName = `${c.first_name} ${c.middle_name || ""} ${c.last_name1} ${c.last_name2 || ""}`.toLowerCase();
        const coincideBusqueda =
            fullName.includes(busqueda.toLowerCase()) ||
            c.document_number?.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.phone?.toLowerCase().includes(busqueda.toLowerCase());
        return coincideBusqueda;
    });

    const indiceUltimo = paginaActual * clientsPorPagina;
    const indicePrimero = indiceUltimo - clientsPorPagina;
    const clientsPagina = clientsFiltrados.slice(indicePrimero, indiceUltimo);
    const totalPaginas = Math.ceil(clientsFiltrados.length / clientsPorPagina);

    const cambiarPagina = (num) => setPaginaActual(num);

    // Crear Client
    const handleCrearClient = async () => {
        if (!nuevoClient.document_type || !nuevoClient.document_number || !nuevoClient.first_name || !nuevoClient.last_name1) {
            Swal.fire("Error", "Los campos tipo de documento, número de documento, primer nombre y primer apellido son requeridos.", "error");
            return;
        }

        try {
            await clientsService.createClient(nuevoClient);
            Swal.fire("Éxito", "Cliente creado correctamente.", "success");
            setMostrarModalNuevo(false);

            // Reset del formulario
            setNuevoClient({
                document_type: "",
                document_number: "",
                first_name: "",
                middle_name: "",
                last_name1: "",
                last_name2: "",
                address: "",
                phone: "",
                email: "",
                city_id: "",
            });

            cargarClients();
        } catch (error) {
            console.error("❌ Error al crear cliente:", error);
            const errorMsg = error.response?.data?.error || "No se pudo crear el cliente.";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Editar Client
    const handleEditar = (client) => {
        setClientEditando({
            ...client,
            city_id: client.city?.id || "",
        });
    };

    const handleGuardar = async () => {
        if (!clientEditando.document_type || !clientEditando.document_number || !clientEditando.first_name || !clientEditando.last_name1) {
            Swal.fire("Error", "Los campos tipo de documento, número de documento, primer nombre y primer apellido son requeridos.", "error");
            return;
        }

        try {
            await clientsService.updateClient(clientEditando.id, {
                document_type: clientEditando.document_type,
                document_number: clientEditando.document_number,
                first_name: clientEditando.first_name,
                middle_name: clientEditando.middle_name,
                last_name1: clientEditando.last_name1,
                last_name2: clientEditando.last_name2,
                address: clientEditando.address,
                phone: clientEditando.phone,
                email: clientEditando.email,
                city_id: clientEditando.city_id || null,
            });

            await cargarClients();
            setClientEditando(null);
            Swal.fire("Éxito", "Cliente actualizado correctamente.", "success");
        } catch (error) {
            console.error("❌ Error al actualizar cliente:", error);
            const errorMsg = error.response?.data?.error || "No se pudo actualizar el cliente.";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    // Eliminar Client
    const handleEliminar = async (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Este cliente será eliminado permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await clientsService.deleteClient(id);
                    await cargarClients();
                    Swal.fire({
                        title: "Eliminado",
                        text: "El cliente ha sido eliminado correctamente.",
                        icon: "success",
                        confirmButtonColor: "#4f46e5",
                    });
                } catch (error) {
                    console.error("❌ Error al eliminar cliente:", error);
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar el cliente.",
                        icon: "error",
                        confirmButtonColor: "#4f46e5",
                    });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">Gestión de Clientes</p>
                                <p className="mt-1 text-blue-100">
                                    Administra los clientes del sistema
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => setMostrarModalNuevo(true)}
                                className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl shadow-lg text-sm font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                            >
                                <UserPlus className="h-5 w-5 mr-2" />
                                Añadir Cliente
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Search className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[250px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre, documento, email o teléfono..."
                                className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 sm:text-sm transition-colors"
                                value={busqueda}
                                onChange={(e) => {
                                    setBusqueda(e.target.value);
                                    setPaginaActual(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tarjetas Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Total Clientes</p>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2">{clients.length}</h2>
                            </div>
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Con Email</p>
                                <h2 className="text-3xl font-bold text-green-600 mt-2">
                                    {clients.filter((c) => c.email).length}
                                </h2>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Con Teléfono</p>
                                <h2 className="text-3xl font-bold text-purple-600 mt-2">
                                    {clients.filter((c) => c.phone).length}
                                </h2>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Users className="h-5 w-5 text-blue-600 mr-2" />
                            Lista de Clientes
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre Completo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Documento</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Teléfono</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Ciudad</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientsPagina.length > 0 ? (
                                    clientsPagina.map((c, index) => (
                                        <tr
                                            key={c.id}
                                            className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-gray-50/50 hover:bg-green-50'
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {`${c.first_name} ${c.middle_name || ""} ${c.last_name1} ${c.last_name2 || ""}`.trim()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {c.document_type} {c.document_number}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{c.email || "-"}</td>
                                            <td className="px-6 py-4 text-gray-700">{c.phone || "-"}</td>
                                            <td className="px-6 py-4 text-gray-700">{c.city?.name || "-"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditar(c)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(c.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-105"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-500">
                                            <Users className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                            <p className="font-medium">No se encontraron clientes</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center p-4 text-sm text-gray-600">
                    <p>
                        Mostrando {clientsPagina.length} de {clientsFiltrados.length} resultados
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={paginaActual === 1}
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            className={`px-3 py-1 rounded-md border ${paginaActual === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                                }`}
                        >
                            Anterior
                        </button>

                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => cambiarPagina(num)}
                                className={`px-3 py-1 rounded-md border ${paginaActual === num ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            disabled={paginaActual === totalPaginas}
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            className={`px-3 py-1 rounded-md border ${paginaActual === totalPaginas
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {/* Modal Editar */}
                {clientEditando && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto p-8 relative border border-gray-200">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                                onClick={() => setClientEditando(null)}
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                                Editar Cliente
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold">Tipo de Documento *</label>
                                    <select
                                        value={clientEditando.document_type}
                                        onChange={(e) =>
                                            setClientEditando({ ...clientEditando, document_type: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                                        <option value="CE">Cédula de Extranjería (CE)</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                        <option value="TI">Tarjeta de Identidad (TI)</option>
                                        <option value="RC">Registro Civil (RC)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Número de Documento *</label>
                                    <input
                                        type="text"
                                        value={clientEditando.document_number}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setClientEditando({ ...clientEditando, document_number: value });
                                        }}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Primer Nombre *</label>
                                    <input
                                        type="text"
                                        value={clientEditando.first_name}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setClientEditando({ ...clientEditando, first_name: value });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Segundo Nombre</label>
                                    <input
                                        type="text"
                                        value={clientEditando.middle_name || ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setClientEditando({ ...clientEditando, middle_name: value });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Primer Apellido *</label>
                                    <input
                                        type="text"
                                        value={clientEditando.last_name1}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setClientEditando({ ...clientEditando, last_name1: value });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Segundo Apellido</label>
                                    <input
                                        type="text"
                                        value={clientEditando.last_name2 || ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setClientEditando({ ...clientEditando, last_name2: value });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-semibold">Dirección</label>
                                    <textarea
                                        value={clientEditando.address || ""}
                                        onChange={(e) =>
                                            setClientEditando({ ...clientEditando, address: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Teléfono</label>
                                    <input
                                        type="text"
                                        value={clientEditando.phone || ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setClientEditando({ ...clientEditando, phone: value });
                                        }}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Email</label>
                                    <input
                                        type="email"
                                        value={clientEditando.email || ""}
                                        onChange={(e) =>
                                            setClientEditando({ ...clientEditando, email: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-semibold">Ciudad</label>
                                    <select
                                        value={clientEditando.city_id || ""}
                                        onChange={(e) =>
                                            setClientEditando({ ...clientEditando, city_id: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    >
                                        <option value="">Seleccione una ciudad</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name} - {city.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGuardar}
                                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg text-sm font-semibold shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Añadir */}
                {mostrarModalNuevo && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto p-8 relative border border-gray-200">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                                onClick={() => setMostrarModalNuevo(false)}
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                                Añadir Nuevo Cliente
                            </h2>

                            <div className="mb-4 border-b pb-2">
                                <h3 className="text-sm font-semibold text-gray-600">
                                    Información del Cliente
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-sm font-semibold">Tipo de Documento *</label>
                                    <select
                                        value={nuevoClient.document_type}
                                        onChange={(e) =>
                                            setNuevoClient({
                                                ...nuevoClient,
                                                document_type: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                                        <option value="CE">Cédula de Extranjería (CE)</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                        <option value="TI">Tarjeta de Identidad (TI)</option>
                                        <option value="RC">Registro Civil (RC)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Número de Documento *</label>
                                    <input
                                        type="text"
                                        placeholder="Número de documento"
                                        value={nuevoClient.document_number}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setNuevoClient({
                                                ...nuevoClient,
                                                document_number: value,
                                            });
                                        }}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Primer Nombre *</label>
                                    <input
                                        type="text"
                                        placeholder="Primer nombre"
                                        value={nuevoClient.first_name}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setNuevoClient({
                                                ...nuevoClient,
                                                first_name: value,
                                            });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Segundo Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Segundo nombre"
                                        value={nuevoClient.middle_name}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setNuevoClient({
                                                ...nuevoClient,
                                                middle_name: value,
                                            });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Primer Apellido *</label>
                                    <input
                                        type="text"
                                        placeholder="Primer apellido"
                                        value={nuevoClient.last_name1}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setNuevoClient({
                                                ...nuevoClient,
                                                last_name1: value,
                                            });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Segundo Apellido</label>
                                    <input
                                        type="text"
                                        placeholder="Segundo apellido"
                                        value={nuevoClient.last_name2}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                                            setNuevoClient({
                                                ...nuevoClient,
                                                last_name2: value,
                                            });
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-semibold">Dirección</label>
                                    <textarea
                                        placeholder="Dirección completa"
                                        value={nuevoClient.address}
                                        onChange={(e) =>
                                            setNuevoClient({
                                                ...nuevoClient,
                                                address: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Teléfono</label>
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={nuevoClient.phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setNuevoClient({
                                                ...nuevoClient,
                                                phone: value,
                                            });
                                        }}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Email</label>
                                    <input
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={nuevoClient.email}
                                        onChange={(e) =>
                                            setNuevoClient({
                                                ...nuevoClient,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-semibold">Ciudad</label>
                                    <select
                                        value={nuevoClient.city_id}
                                        onChange={(e) =>
                                            setNuevoClient({
                                                ...nuevoClient,
                                                city_id: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    >
                                        <option value="">Seleccione una ciudad</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name} - {city.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleCrearClient}
                                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg text-sm font-semibold shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                Crear Cliente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clients;
