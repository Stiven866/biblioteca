import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

class NuevoSuscriptor extends Component {
    state = {
        nombre: '',
        apellido: '',
        carrera: '',
        codigo: ''
    }

    //extraer los valores del input y colocarlos en el state
    leerDato = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //Agrega un nuevo suscriptor a la base de Datos 
    agregarSuscriptor = e => {
        e.preventDefault();

        //extraer  datos del state
        const nuevoSuscriptor = this.state;

        const { firestore, history } = this.props;

        firestore.add({ collection : 'suscriptores'}, nuevoSuscriptor)
        .then(() => history.push('/suscriptores'))


        //extaer firestore de props


        //Guardar en base de Datos

    }



    render(){
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
                        <i className="fas fa-user-plus"></i> {''}
                        Nuevo Suscriptor
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.agregarSuscriptor}
                            >
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        placeholder="Nombre del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.nombre}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Apellido:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="apellido"
                                        placeholder="Apellido del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.apellido}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Carrera:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="carrera"
                                        placeholder="Carrera del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.carrera}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Código:</label>
                                    <input 
                                        type="number"
                                        className="form-control"
                                        name="codigo"
                                        placeholder="Código del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.codigo}
                                    />
                                </div>
                                <input 
                                    type="submit"
                                    value="Agregar Suscriptor"
                                    className="btn btn-success"
                                    />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


NuevoSuscriptor.propTypes = {
    firestore : PropTypes.object.isRequired
}

export default firestoreConnect() (NuevoSuscriptor);