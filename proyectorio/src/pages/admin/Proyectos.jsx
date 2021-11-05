import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { obtenerProductos, crearProducto, editarProducto, eliminarProducto } from 'utils/api';
import 'react-toastify/dist/ReactToastify.css';
import PrivateComponent from 'components/PrivateComponent';

const Productos = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [productos, setProductos] = useState([]);
  const [textoBoton, setTextoBoton] = useState('Agregar Producto');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

  useEffect(() => {
    console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      obtenerProductos(
        (response) => {
          console.log('la respuesta que se recibio fue', response);
          setProductos(response.data);
          setEjecutarConsulta(false);
        },
        (error) => {
          console.error('Salio un error:', error);
        }
      );
    }
  }, [ejecutarConsulta]);

  useEffect(() => {
    //obtener lista de vehículos desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);

  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Agregar Nuevo Producto');
      
    } else {
      setTextoBoton('Mostrar Todos Los Productos');
      
    }
  }, [mostrarTabla]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start p-8'>
      <div className='flex flex-col'>
        <h2 className='text-3xl pt-12 pb-8 font-extrabold fuenteColor'>
          Administración de Productos
        </h2>
        <PrivateComponent roleList={['Administrador']}>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
          }}
          className={`shadow-md fondo1 text-gray-300 font-bold p-2 rounded m-6  self-center`}>
          {textoBoton}
        </button>
        </PrivateComponent>
      </div>
      {mostrarTabla ? (
        <TablaProductos listaProductos={productos} setEjecutarConsulta={setEjecutarConsulta} />
        ) : (
          <FormularioCreacionProductos
            setMostrarTabla={setMostrarTabla}
            listaProductos={productos}
            setProductos={setProductos}
          />
        )}
        <ToastContainer position='bottom-center' autoClose={3000} />
      </div>
    );
  };

  const TablaProductos = ({ listaProductos, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);
  
    useEffect(() => {
      setProductosFiltrados(
        listaProductos.filter((elemento) => {
          return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
        })
      );
    }, [busqueda, listaProductos]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder='Buscar'
        className='border-2 border-gray-700 ml-3 mb-2 px-3 py-1 w-40 self-start rounded-md focus:outline-none focus:border-gray-500'
      />
      
        <table className="tabla w-full">
          <thead>
            <tr>
              <th className="fondo1  text-gray-300 w-28">Código ID</th>
              <th className="fondo1  text-gray-300 w-36">Producto</th>
              <th className="fondo1  text-gray-300 w-24">Modelo</th>
              <th className="fondo1  text-gray-300 w-20">Núcleos</th>
              <th className="fondo1  text-gray-300 w-28">Frecuencia</th>
              <th className="fondo1  text-gray-300 w-32">Precio USD</th>
              <th className="fondo1  text-gray-300 w-32">Estado</th>
              <PrivateComponent roleList={['Administrador']}>
                <th className="fondo1  text-gray-300 w-24">Acciones</th>  
              </PrivateComponent>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => {
              return <FilaProductos 
                key={nanoid()} 
                producto={producto}
                setEjecutarConsulta={setEjecutarConsulta}/>;
            })}
          </tbody>
        </table>
      
    </div>
  );
};

const FilaProductos = ({producto, setEjecutarConsulta})  => {
  const [edit, setEdit] = useState(false)
  const [infoNuevoProducto, setInfoNuevoProducto] = useState({
    _id: producto._id,
    producto: producto.producto,
    modelo: producto.modelo,
    nucleos: producto.nucleos,
    frecuencia: producto.frecuencia,
    precio: producto.precio,
    estado: producto.estado,    
  });

  const actualizarProducto = async () => {
    //enviar la info al backend

    await editarProducto(
      producto._id,
      {
        producto: infoNuevoProducto.producto,
        modelo: infoNuevoProducto.modelo,
        nucleos: infoNuevoProducto.nucleos,
        frecuencia: infoNuevoProducto.frecuencia,
        precio: infoNuevoProducto.precio,
        estado: infoNuevoProducto.estado,
        
      },
      (response) => {
        console.log(response.data);
        toast.success('Producto Modificado Exitosamente');
        setEdit(false);
        setEjecutarConsulta(true);
      },
      (error) => {
        toast.error('Error Modificando Producto');
        console.error(error);
      }
    );
    
      
  };
  
  const borrarProducto = async () => {
    await eliminarProducto(
      producto._id,
      (response) => {
        console.log(response.data);
        toast.success('Producto Eliminado Exitosamente');
        setEjecutarConsulta(true);
        
      },
      (error) => {
        console.error(error);
        toast.error('Error Eliminando Producto');
      }
    );
  
    
  };

  return (
    <tr >
      {edit? (
        <>
        
          <td className='text-center'>{infoNuevoProducto._id.slice(20)}
          </td>
          <td><input 
            type="text" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoProducto.producto}
            onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, producto: e.target.value })}/>
          </td>
          <td><input 
            type="number" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoProducto.modelo}
            onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, modelo: e.target.value })}/>
            </td>
            <td><input 
            type="number" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoProducto.nucleos}
            onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, nucleos: e.target.value })}/>
          </td>
            <td><input 
            type="text" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoProducto.frecuencia}
            onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, frecuencia: e.target.value })}/>
          </td>
          
          <td><input 
            type="number" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoProducto.precio}
            onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, precio: e.target.value })}/>
          </td>
          <td>
            <label className='flex flex-col py-2 text-gray-800' htmlFor='estado'>
              <select
                className='bg-gray-50 border border-gray-600 p-1 rounded-lg m-1 w-full'
                name='estado'
                required
                defaultValue={infoNuevoProducto.estado}
                onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, estado: e.target.value })}>
                  <option disabled value={0}>
                    Seleccione Una Opción
                  </option>
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No Disponible</option>
              </select>
            </label> 
          </td>
            
            
            
        </>
        
      ) :(
      <>
          <td className=" text-center text-gray-800">{producto._id.slice(20)}</td>
          <td className=" text-center text-gray-800">{producto.producto}</td>
          <td className=" text-center text-gray-800">{producto.modelo}</td>
          <td className=" text-center text-gray-800">{producto.nucleos}</td>
          <td className=" text-center text-gray-800">{producto.frecuencia}</td>
          <td className=" text-center text-gray-800">{producto.precio}</td>
          <td className=" text-center text-gray-800">{producto.estado}</td>
      </>  
        )}
          <PrivateComponent roleList={['Administrador']}>
        <td>
            <div className="flex w-full justify-around text-gray-800 ">
              {edit? (
                <>
                  <i
                    onClick={() => actualizarProducto()} 
                    className="fas fa-check hover:text-green-600"/>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-ban hover:text-yellow-700'/>
                </>
              ):(
                <>
                  <i
                    onClick={() => setEdit(!edit)}
                    className="fas fa-edit hover:text-yellow-600"/>
                
                    
                  <i
                      onClick={() => borrarProducto()}
                      class="fas fa-trash text-gray-800 hover:text-red-500"/>
                </>
              )} 
              
            </div>
            

        </td>
          </PrivateComponent>
      
    </tr>

  );
};

const FormularioCreacionProductos = ({ setMostrarTabla, listaProductos, setProductos }) => {
  const form = useRef(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevoProducto = {};
    fd.forEach((value, key) => {
      nuevoProducto[key] = value;
    });

    await crearProducto(
      {
        producto: nuevoProducto.producto,
        modelo: nuevoProducto.modelo,
        nucleos: nuevoProducto.nucleos,
        frecuencia: nuevoProducto.frecuencia,
        precio: nuevoProducto.precio,
        estado: nuevoProducto.estado,
      },
      (response) => {
        console.log(response.data);
        toast.success('Producto Creado Exitosamente');
        setMostrarTabla(true);
      },
      (error) => {
        console.error(error);
        toast.error('Error Creando Producto');
      }
    );
    setMostrarTabla(true);
  };
    
  

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-extrabold pb-4 text-gray-800'>Nuevo Producto</h2>
      <form ref={form} onSubmit={submitForm} className='flex flex-col justify-center text-center pb-10'>
        
        <label className='flex flex-col py-2 text-gray-800' htmlFor='producto'>
          Nombre del Producto
          <input
            name='producto'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2 '
            type='text'
            placeholder='Ej: Producto 12'
            required/>
        </label>
        
        <label className='flex flex-col py-2 text-gray-800' htmlFor='modelo'>
          Modelo del Producto
          <input
            name='modelo'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            min={2018}
            max={2025}
            placeholder='Ej: 2019'
            required/>
        </label>
        <label className='flex flex-col py-2 text-gray-800' htmlFor='nucleos'>
          Número de Núcleos
          <input
            name='nucleos'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            min={2}
            max={256}
            placeholder='Ej: 8'
            required/>
        </label>
        <label className='flex flex-col py-2 text-gray-800' htmlFor='frecuencia'>
          Frecuencia del Producto
          <input
            name='frecuencia'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            placeholder='Ej: 4,8GHz'
            required/>
        </label>
        
        <label className='flex flex-col py-2 text-gray-800' htmlFor='precio'>    
          Precio de Venta
          <input
            name='precio'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            min={200}
            max={5000}
            placeholder='Ej: 230'
            required/>
        </label>
        <label className='flex flex-col py-2 text-gray-800' htmlFor='estado'>
          Estado del Producto
          <select
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            name='estado'
            required
            defaultValue={0}
          >
            <option disabled value={0}>
              Seleccione Una Opción
            </option>
            <option>Disponible</option>
            <option>No Disponible</option>
          </select>
        </label>
        <button
          type='submit'
          className='col-span-2 py-3 fondo1 font-bold  text-gray-300 p-2 rounded-full shadow-md hover:bg-blue-600'
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
};
            

export default Productos;