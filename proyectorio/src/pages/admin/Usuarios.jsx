import React, { useEffect, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {nanoid} from 'nanoid';
import { obtenerUsuarios, editarUsuario} from 'utils/api';


const Usuarios = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

  useEffect(() => {
    console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      obtenerUsuarios(
        (response) => {
          console.log('la respuesta que se recibio fue', response);
          setUsuarios(response.data);
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


  
 
  return (
    <div className='flex h-full w-full flex-col items-center justify-start p-8'>
      <div className='flex flex-col'>
        <h2 className='text-3xl pt-12 pb-12 font-extrabold text-gray-800'>
          Administración de Usuarios
        </h2>
        
      </div>
      {mostrarTabla ? (
        <TablaUsuarios listaUsuarios={usuarios} setEjecutarConsulta={setEjecutarConsulta}/>
      ) : (
        <TablaUsuarios
          setMostrarTabla={setMostrarTabla}
          listaUsuarios={usuarios}
          setUsuarios={setUsuarios}
        />
      )}
      <ToastContainer position='bottom-center' autoClose={4000} />
    </div>
  );
};

const TablaUsuarios = ({ listaUsuarios, setEjecutarConsulta }) => {
  const [busqueda, setBusqueda] = useState('');
  const [usuriosFiltrados, setUsuariosFiltrados] = useState(listaUsuarios);
  
  useEffect(() => {
    setUsuariosFiltrados(
      listaUsuarios.filter((elemento) => {
        return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, listaUsuarios]);
  
  useEffect(() => {
  }, [listaUsuarios]);
  const submitEdit= (e)=> {
    e.preventDefault();
    console.log(e);

  }
  return (
    <div className='flex flex-col items-center justify-center'>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder='Buscar'
        className='border-2 border-gray-700 ml-3 mb-2 px-3 py-1 w-40 self-start rounded-md focus:outline-none focus:border-gray-500'
      />
       
        <table className="tabla w-full ">
          <thead>
            <tr>
              <th className="fondo1 text-gray-300 w-32"> ID Usuario</th>
              <th className="fondo1 text-gray-300 w-44"> Nombre Completo</th>
              <th className="fondo1 text-gray-300 w-32">Correo</th>
              <th className="fondo1 text-gray-300 w-32">Rol</th> 
              <th className="fondo1 text-gray-300 w-32">Estado</th> 
              <th className="fondo1 text-gray-300 w-36">Editar</th>
            </tr>
          </thead>
          <tbody>
            {usuriosFiltrados.map((usuario) => {
              return <FilaUsuarios 
                key={nanoid()} 
                usuario={usuario}
                setEjecutarConsulta={setEjecutarConsulta}/>;
            })}
          </tbody>
        </table>
      
    </div>
  );
};

const FilaUsuarios = ({usuario, setEjecutarConsulta})  => {
  const [edit, setEdit] = useState(false)
  const [infoNuevoUsuario, setInfoNuevoUsuario] = useState({
    _id: usuario._id,
    name: usuario.name,
    
    email: usuario.email,
    rol: usuario.rol,
    estado: usuario.estado,
  });
  const actualizarUsuario = async () => {
    //enviar la info al backend

    await editarUsuario(
      usuario._id,
      {
        name: infoNuevoUsuario.name,
        email: infoNuevoUsuario.email,
        rol: infoNuevoUsuario.rol,
        estado: infoNuevoUsuario.estado,
        
      },
      (response) => {
        console.log(response.data);
        toast.success('Usuario Modificado Exitosamente');
        setEdit(false);
        setEjecutarConsulta(true);
      },
      (error) => {
        toast.error('Error Modificando Usuario');
        console.error(error);
      }
    );
    
      
  };
       
  return (
    <tr >
      {edit? (
        <>
        
          <td className='text-center'>{infoNuevoUsuario._id.slice(20)}</td>
          
          <td><input 
            type="text" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoUsuario.name}
            onChange={(e) => setInfoNuevoUsuario({ ...infoNuevoUsuario, name: e.target.value })}/>
          </td>
          <td><input 
            type="email" 
            className="bg-gray-50 border border-gray-600 p-1 text-center rounded-lg m-1 w-full"
            value={infoNuevoUsuario.email}
            onChange={(e) => setInfoNuevoUsuario({ ...infoNuevoUsuario, email: e.target.value })}/>
          </td>
          
          <td>
            <form>
              <select
              className="bg-gray-50 border border-gray-600 p-1 rounded-lg m-1 w-full"
              name='rol'
              required
              onChange ={(e) => setInfoNuevoUsuario({ ...infoNuevoUsuario, rol: e.target.value })}
              defaultValue={infoNuevoUsuario.rol}>
                <option disabled value={0}>
                Seleccione Rol
                </option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
                <option value="Sin Rol">Sin Rol</option>
              </select>
            </form>
          </td>
          <td>
            <form>
              <select
              className="bg-gray-50 border border-gray-600 p-1 rounded-lg m-1 w-full"
              name='estado'
              required
              onChange ={(e) => setInfoNuevoUsuario({ ...infoNuevoUsuario, estado: e.target.value })}
              defaultValue={infoNuevoUsuario.rol}>
                <option disabled value={0}>
                Seleccione Estado
                </option>
                <option value="Pendiente">Pendiente</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>

            </form>
          </td>
          
        </>
        
      ) :(
      <>
          <td className=" text-center text-gray-800">{usuario._id.slice(20)}</td>
          <td className=" text-center text-gray-800">{usuario.name}</td>
          <td className=" text-center text-gray-800">{usuario.email}</td>
          <td className=" text-center text-gray-800">{usuario.rol}</td>
          <td className=" text-center text-gray-800">{usuario.estado}</td>
          
        </>  
        )}
        <td>
          <div className="flex w-full justify-around text-gray-800 ">
            {edit? (
              <>
                <i
                  onClick={() => actualizarUsuario()} 
                  className="fas fa-check hover:text-green-600"/>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-ban hover:text-yellow-700'/>
              </>
            ):(
              <>
                <i
                  onClick={() => setEdit(!edit)}
                  className="fas fa-user-edit hover:text-yellow-600"/>
                
              </>
            )} 
            
          </div>
        </td>
      
    </tr>

  );
};

export default Usuarios;