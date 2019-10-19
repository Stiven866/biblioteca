import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

//REDUX Actions
import { buscarUsuario } from '../../redux/actions/buscarUsuarioActions';


class PrestamoLibro extends Component {
    state={
        noResultado: false,
        busqueda : '',
    }

    //Buscar Alumno
    buscarAlumno = e => {
        e.preventDefault();

        //obtener el valor a buscar
        const { busqueda } = this.state;

        //extraer firestore 
        const { firestore, buscarUsuario } = this.props;
        
        //hacer la consulta 
        const coleccion = firestore.collection('suscriptores');
        const consulta =  coleccion.where("codigo", "==", busqueda).get();

        //leer resultados
        consulta.then(resultado => {
            if(resultado.empty){
                buscarUsuario({});
                this.setState({
                    noResultado : true

                })
            }else {

                const datos = resultado.docs[0];
                buscarUsuario(datos.data());
                
                this.setState({
                    noResultado : false
                })
            }
        })
        //console.log(consulta);
    }

    //almacena los datos del alumno para solicitar el libro 
    solicitarPrestamo = () =>{

        const { usuario } = this.props;

        usuario.fecha_solicitud = new Date().toLocaleDateString();

        let prestados = [];
        prestados = [...this.props.libro.prestados, usuario];

        // Copiar el objeto y agregar los prestados
        const libro = {...this.props.libro};

        // eliminar los prestados anteriores
        delete libro.prestados;

        // asignar los prestados
        libro.prestados = prestados;

        // extraer firestore
        const {firestore, history} = this.props;

        // almacenar en la BD
        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libro ).then(history.push('/'));
    
    }
    

    //Almacenar el código en el state

    leerDato = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render(){

        const { libro } = this.props;

        if(!libro) return <Spinner />

        const { usuario } = this.props;

        let fichaAlumno, btnSolicitar;

        if(usuario.nombre){
            fichaAlumno = <FichaSuscriptor 
                            alumno={usuario}
                            />
            btnSolicitar = <button
                                type="button"
                                className="btn btn-success btn-block mb-3"
                                onClick={this.solicitarPrestamo}
                            >Solicitar Prestamo</button>
        }else {
            fichaAlumno = null;
            btnSolicitar = null;
        }

        const {noResultado} = this.state;

        let mensajeResultado = '';
        if(noResultado) {
            mensajeResultado = <div className="alert alert-danger text-center font-weight-bold">No hay resultados para ese código.</div>
        } else {
            mensajeResultado = null;
        }

        return(
            <div className="row">
                <div className="col-12 mb-4">
                    <Link 
                        to={'/suscriptores'}
                        className="btn btn-secondary"
                        >
                            <i className="fas fa-arrow-circle-left"></i> {''}
                            Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i> {''}
                        Solicitar Prestamo : {libro.titulo}
                    </h2>

                    <div className="row justify-content-center mt-5">
                        <div className="col-md-8">
                            <form
                                onSubmit={this.buscarAlumno}
                                className="mb-4"
                            >
                                <legend className="color-primary text-center">
                                    Bucar el Suscriptor por el Código
                                </legend>
                                <div className="form-group">
                                    <input 
                                        type="text"
                                        name="busqueda"
                                        className="form-control"
                                        onChange={this.leerDato}
                                    />
                                </div>
                                <input value="Buscar Suscriptor" type="submit" className="btn btn-success btn-block"/>
                            </form>
                            {/*Muestra Ficha y botón*/}
                            {fichaAlumno}
                            {btnSolicitar}

                            {/* Muestra un mensaje de no resultados */}
                            
                            {mensajeResultado}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 

PrestamoLibro.propTypes = {
    firestore : PropTypes.object.isRequired
}

export default compose(
    firestoreConnect(props => [
        {
            collection : 'libros',
            storeAs : 'libro',
            doc : props.match.params.id
        }
    ]),
    connect(({ firestore : {ordered}, usuario }, props) => ({
        libro : ordered.libro && ordered.libro[0],
        usuario : usuario
    }), { buscarUsuario })
) (PrestamoLibro);
