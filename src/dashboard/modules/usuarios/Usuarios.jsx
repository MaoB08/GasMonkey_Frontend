import React, { useState, useEffect } from "react";
import {
  listarUsuarios,
  editarUsuario,
  eliminarUsuario,
  crearUsuario,
} from "./usuariosService";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina] = useState(5);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    stf_first_name: "",
    stf_middle_name: "",
    stf_first_surname: "",
    stf_second_surname: "",
    stf_user: "",
    stf_password: "",
    confirmar_password: "",
    stf_active: "1",
    stf_email: "",
    stf_document_number: "",
    stf_role: "",
    stf_department: "",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
    }
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideBusqueda =
      u.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado =
      filtroEstado === "Todos" || u.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const indiceUltimo = paginaActual * usuariosPorPagina;
  const indicePrimero = indiceUltimo - usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const cambiarPagina = (num) => setPaginaActual(num);

  // Crear Usuario
  const handleCrearUsuario = async () => {
    if (nuevoUsuario.stf_password !== nuevoUsuario.confirmar_password) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    const usuarioBackend = {
      STF_First_Name: nuevoUsuario.stf_first_name,
      STF_Middle_Name: nuevoUsuario.stf_middle_name,
      STF_First_Surname: nuevoUsuario.stf_first_surname,
      STF_Second_Surname: nuevoUsuario.stf_second_surname,
      STF_User: nuevoUsuario.stf_user,
      STF_Password: nuevoUsuario.stf_password,
      STF_Email: nuevoUsuario.stf_email,
      STF_Document_Number: nuevoUsuario.stf_document_number,
      STF_Role: nuevoUsuario.stf_role,
      STF_Department: nuevoUsuario.stf_department,
      STF_Active: nuevoUsuario.stf_active,
    };

    try {
      await crearUsuario(usuarioBackend);
      Swal.fire("Éxito", "Usuario creado correctamente.", "success");
      setMostrarModalNuevo(false);

      // Reset del formulario
      setNuevoUsuario({
        stf_first_name: "",
        stf_middle_name: "",
        stf_first_surname: "",
        stf_second_surname: "",
        stf_user: "",
        stf_password: "",
        confirmar_password: "",
        stf_active: "1",
        stf_email: "",
        stf_document_number: "",
        stf_role: "",
        stf_department: "",
      });

      cargarUsuarios();
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      Swal.fire("Error", "No se pudo crear el usuario.", "error");
    }
  };


  // Editar Usuario
  const handleEditar = (usuario) => {
    const partes = usuario.nombre_completo?.trim().split(" ") || [];
    setUsuarioEditando({
      ...usuario,
      primer_nombre: partes[0] || "",
      segundo_nombre: partes[1] || "",
      primer_apellido: partes[2] || "",
      segundo_apellido: partes[3] || "",
    });
  };

  const handleGuardar = async () => {
    try {
      await editarUsuario(usuarioEditando.id, {
        STF_First_Name: usuarioEditando.primer_nombre,
        STF_Middle_Name: usuarioEditando.segundo_nombre,
        STF_First_Surname: usuarioEditando.primer_apellido,
        STF_Second_Surname: usuarioEditando.segundo_apellido,
        STF_User: usuarioEditando.usuario,
        STF_Email: usuarioEditando.email,
        STF_Document: usuarioEditando.documento,
        STF_Active: usuarioEditando.estado === "Activo" ? "1" : "0",
      });

      await cargarUsuarios();
      setUsuarioEditando(null);
      Swal.fire("Éxito", "Usuario actualizado correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
    }
  };

  // Eliminar Usuario
  const handleEliminar = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este usuario será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarUsuario(id);
          await cargarUsuarios();
          Swal.fire({
            title: "Eliminado",
            text: "El usuario ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el usuario.",
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
        <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl shadow-xl p-8 mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Gestión de Usuarios</p>
                <p className="mt-1 text-green-100">
                  Administra los usuarios del sistema
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setMostrarModalNuevo(true)}
                className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl shadow-lg text-sm font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Añadir Usuario
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Search className="h-5 w-5 text-green-600" />
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
                placeholder="Buscar nombre, email o usuario..."
                className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400 sm:text-sm transition-colors"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
              />
            </div>
            <select
              className="px-4 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400 sm:text-sm transition-colors"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>


        {/* Tarjetas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Usuarios</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">{usuarios.length}</h2>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Activos</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {usuarios.filter((u) => u.estado === "Activo").length}
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
                <p className="text-sm font-semibold text-gray-600">Inactivos</p>
                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                  {usuarios.filter((u) => u.estado === "Inactivo").length}
                </h2>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Emails únicos</p>
                <h2 className="text-3xl font-bold text-purple-600 mt-2">
                  {new Set(usuarios.map((u) => u.email)).size}
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
              <Users className="h-5 w-5 text-green-600 mr-2" />
              Lista de Usuarios
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre Completo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPagina.length > 0 ? (
                  usuariosPagina.map((u, index) => (
                    <tr
                      key={u.id}
                      className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-gray-50/50 hover:bg-green-50'
                        }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{u.nombre_completo}</td>
                      <td className="px-6 py-4 text-gray-700">{u.usuario}</td>
                      <td className="px-6 py-4 text-gray-700">{u.email}</td>
                      <td className="px-6 py-4 text-gray-700">{u.documento}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 text-xs rounded-lg font-bold border-2 ${u.estado === "Activo"
                            ? "bg-green-50 text-green-800 border-green-300"
                            : "bg-red-50 text-red-800 border-red-300"
                            }`}
                        >
                          {u.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditar(u)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(u.id)}
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
                      <p className="font-medium">No se encontraron usuarios</p>
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
            Mostrando {usuariosPagina.length} de {usuariosFiltrados.length} resultados
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

        {/* Editar*/}
        {usuarioEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] p-8 relative border border-gray-200">

              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                onClick={() => setUsuarioEditando(null)}
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Editar Usuario
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Primer Nombre</label>
                  <input
                    type="text"
                    value={usuarioEditando.primer_nombre}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                      setUsuarioEditando({ ...usuarioEditando, primer_nombre: value });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Segundo Nombre</label>
                  <input
                    type="text"
                    value={usuarioEditando.segundo_nombre}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                      setUsuarioEditando({ ...usuarioEditando, segundo_nombre: value });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Primer Apellido</label>
                  <input
                    type="text"
                    value={usuarioEditando.primer_apellido}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                      setUsuarioEditando({ ...usuarioEditando, primer_apellido: value });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Segundo Apellido</label>
                  <input
                    type="text"
                    value={usuarioEditando.segundo_apellido}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                      setUsuarioEditando({ ...usuarioEditando, segundo_apellido: value });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Documento</label>
                  <input
                    type="text"
                    value={usuarioEditando.documento}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setUsuarioEditando({ ...usuarioEditando, documento: value });
                    }}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Correo</label>
                  <input
                    type="email"
                    value={usuarioEditando.email}
                    onChange={(e) =>
                      setUsuarioEditando({ ...usuarioEditando, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold">Estado</label>
                  <select
                    value={usuarioEditando.estado}
                    onChange={(e) =>
                      setUsuarioEditando({ ...usuarioEditando, estado: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGuardar}
                className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg text-sm font-semibold shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Guardar Cambios
              </button>

            </div>
          </div>
        )}

        {/* Añadir usuario */}
        {mostrarModalNuevo && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] p-8 relative border border-gray-200">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                onClick={() => setMostrarModalNuevo(false)}
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Añadir Nuevo Usuario
              </h2>

              <div className="mb-4 border-b pb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Información básica
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Primer nombre"
                  value={nuevoUsuario.stf_first_name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_first_name: value,
                    });
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Segundo nombre"
                  value={nuevoUsuario.stf_middle_name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_middle_name: value,
                    });
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Primer apellido"
                  value={nuevoUsuario.stf_first_surname}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_first_surname: value,
                    });
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Segundo apellido"
                  value={nuevoUsuario.stf_second_surname}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_second_surname: value,
                    });
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Documento"
                  value={nuevoUsuario.stf_document_number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_document_number: value,
                    });
                  }}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={nuevoUsuario.stf_email}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_email: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Usuario"
                  value={nuevoUsuario.stf_user}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_user: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={nuevoUsuario.stf_password}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_password: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={nuevoUsuario.confirmar_password}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      confirmar_password: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="mb-2 border-b pb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Rol y departamento
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                  value={nuevoUsuario.stf_role}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_role: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="">Seleccione Rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Jefe">Jefe</option>
                  <option value="Empleado">Empleado</option>
                  <option value="Vendedor">Vendedor</option>
                </select>

                <select
                  value={nuevoUsuario.stf_department}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_department: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="">Seleccione Departamento</option>
                  <option value="Dirección">Dirección</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Almacén">Almacén</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Estado
                </h3>
                <select
                  value={nuevoUsuario.stf_active}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      stf_active: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>

              <button
                onClick={handleCrearUsuario}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg text-sm font-semibold shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default Usuarios;
