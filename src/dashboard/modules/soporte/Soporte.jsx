import React, { useState } from 'react';
import {
    HelpCircle,
    Mail,
    Phone,
    MessageSquare,
    Book,
    Send,
    ChevronDown,
    ChevronUp,
    CheckCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { sendSupportMessage } from './supportService';

const Soporte = () => {
    const [activeTab, setActiveTab] = useState('faq');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    // FAQs organizadas por categoría
    const faqs = [
        {
            categoria: 'Ventas',
            preguntas: [
                {
                    id: 1,
                    pregunta: '¿Cómo crear una nueva venta?',
                    respuesta: 'Ve al módulo de Ventas, haz clic en "Nueva Venta", busca el cliente por documento, agrega productos y selecciona el método de pago. Finalmente, haz clic en "Crear Venta".'
                },
                {
                    id: 2,
                    pregunta: '¿Cómo funciona el sistema de apartado?',
                    respuesta: 'Al crear una venta, selecciona "Apartado" como método de pago, ingresa el pago inicial. El sistema calculará automáticamente el saldo pendiente. Puedes agregar pagos adicionales desde el detalle de la venta.'
                },
                {
                    id: 3,
                    pregunta: '¿Cómo descargar una factura?',
                    respuesta: 'Desde el detalle de la venta, haz clic en el botón "📄 Descargar Factura". El PDF se descargará automáticamente con toda la información de la venta.'
                }
            ]
        },
        {
            categoria: 'Inventario',
            preguntas: [
                {
                    id: 4,
                    pregunta: '¿Cómo agregar un nuevo producto?',
                    respuesta: 'Ve a Inventario > Productos, haz clic en "Añadir Producto", completa la información (nombre, categoría, precio, stock) y guarda. El código se genera automáticamente.'
                },
                {
                    id: 5,
                    pregunta: '¿Cómo crear categorías?',
                    respuesta: 'Accede a Inventario > Categorías, haz clic en "Añadir Categoría", ingresa el nombre y prefijo del código. Los productos de esta categoría usarán este prefijo.'
                }
            ]
        },
        {
            categoria: 'Clientes',
            preguntas: [
                {
                    id: 6,
                    pregunta: '¿Cómo registrar un nuevo cliente?',
                    respuesta: 'En el módulo de Clientes, haz clic en "Añadir Cliente", completa los datos requeridos (tipo de documento, número, nombres y apellidos) y guarda.'
                },
                {
                    id: 7,
                    pregunta: '¿Puedo editar la información de un cliente?',
                    respuesta: 'Sí, desde la lista de clientes, haz clic en el botón "Editar" del cliente que deseas modificar, actualiza la información y guarda los cambios.'
                }
            ]
        },
        {
            categoria: 'Usuarios',
            preguntas: [
                {
                    id: 8,
                    pregunta: '¿Cómo crear un nuevo usuario?',
                    respuesta: 'Ve a Usuarios, haz clic en "Añadir Usuario", completa todos los campos requeridos incluyendo rol y departamento. Las contraseñas deben coincidir.'
                },
                {
                    id: 9,
                    pregunta: '¿Qué roles están disponibles?',
                    respuesta: 'Los roles disponibles son: Administrador (acceso completo), Jefe (gestión de departamento), Empleado (operaciones básicas) y Vendedor (ventas y clientes).'
                }
            ]
        }
    ];

    const guiasRapidas = [
        {
            titulo: 'Realizar una venta completa',
            pasos: [
                'Ir al módulo de Ventas',
                'Hacer clic en "Nueva Venta"',
                'Buscar cliente por documento',
                'Agregar productos a la venta',
                'Seleccionar método de pago',
                'Confirmar y crear venta',
                'Descargar factura si es necesario'
            ]
        },
        {
            titulo: 'Gestionar inventario',
            pasos: [
                'Crear categorías en Inventario > Categorías',
                'Agregar productos en Inventario > Productos',
                'Asignar categoría, precio y stock',
                'El sistema actualiza stock automáticamente con las ventas'
            ]
        },
        {
            titulo: 'Configurar facturación electrónica',
            pasos: [
                'Completar información de la empresa',
                'Configurar certificado DIAN',
                'Seleccionar "Electrónica (DIAN)" al crear venta',
                'El sistema valida y envía a DIAN automáticamente'
            ]
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
            Swal.fire('Error', 'Por favor completa todos los campos', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            await sendSupportMessage(formData);

            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: 'Nos pondremos en contacto contigo pronto.',
                confirmButtonColor: '#10b981'
            });

            // Limpiar formulario
            setFormData({
                nombre: '',
                email: '',
                asunto: '',
                mensaje: ''
            });
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error || 'No se pudo enviar el mensaje. Por favor, intenta nuevamente.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <HelpCircle className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">Centro de Soporte</p>
                            <p className="mt-1 text-purple-100">
                                Encuentra ayuda y recursos para usar GasMonkey
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('faq')}
                            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'faq'
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Book className="w-5 h-5" />
                                Preguntas Frecuentes
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('contacto')}
                            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'contacto'
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Contacto
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('guias')}
                            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'guias'
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Guías Rápidas
                            </div>
                        </button>
                    </div>
                </div>

                {/* Contenido de tabs */}
                {activeTab === 'faq' && (
                    <div className="space-y-6">
                        {faqs.map((categoria, catIndex) => (
                            <div key={catIndex} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-purple-600 rounded"></div>
                                    {categoria.categoria}
                                </h3>
                                <div className="space-y-3">
                                    {categoria.preguntas.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
                                        >
                                            <button
                                                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="font-semibold text-gray-900 text-left">{faq.pregunta}</span>
                                                {expandedFaq === faq.id ? (
                                                    <ChevronUp className="w-5 h-5 text-purple-600" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                            {expandedFaq === faq.id && (
                                                <div className="px-4 py-3 bg-white border-t border-gray-200">
                                                    <p className="text-gray-700">{faq.respuesta}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'contacto' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Formulario de contacto */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Send className="w-6 h-6 text-purple-600" />
                                Envíanos un mensaje
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Asunto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.asunto}
                                        onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        value={formData.mensaje}
                                        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                                        rows="5"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                                        placeholder="Describe tu consulta o problema..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                                </button>
                            </form>
                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <Mail className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Email</p>
                                            <p className="text-gray-600">soporte@gasmonkey.com</p>
                                            <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <Phone className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Teléfono</p>
                                            <p className="text-gray-600">+57 (1) 234-5678</p>
                                            <p className="text-sm text-gray-500">Lun - Vie: 8:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <MessageSquare className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">WhatsApp</p>
                                            <p className="text-gray-600">+57 300 123 4567</p>
                                            <p className="text-sm text-gray-500">Atención inmediata</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-purple-200 p-6">
                                <h4 className="font-bold text-gray-900 mb-2">💡 Consejo</h4>
                                <p className="text-gray-700 text-sm">
                                    Antes de contactarnos, revisa las preguntas frecuentes. La mayoría de las dudas se resuelven allí de forma inmediata.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'guias' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guiasRapidas.map((guia, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-purple-600 font-bold">{index + 1}</span>
                                    </div>
                                    {guia.titulo}
                                </h3>
                                <ol className="space-y-2">
                                    {guia.pasos.map((paso, pasoIndex) => (
                                        <li key={pasoIndex} className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm">{paso}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Soporte;
