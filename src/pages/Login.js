import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Cookies from "universal-cookie"
import axios from 'axios';
import md5 from 'md5';
const baseUrl = "http://localhost:3001/usuarios"


const cookies = new Cookies()


class Login extends Component {

    state = {
        form: {username:'', password:''}
    }


    handleChange= async e=>{
        await this.setState({
            form: {
               ...this.state.form,
               [e.target.name]: e.target.value
            }
        });
        console.log("Valor de form dentro de state (this.state.form)")
        console.log(this.state)
        console.log("valor de e.target.name")
        console.log(e.target.name)
        console.log("valor de e.target.value")
        console.log(e.target.value)
        
    }

    iniciarSesion=async () => {
        console.log("Se llammo a la funcion inicarSesion")

        await axios.get(baseUrl, {params:{username:this.state.form.username, password:md5(this.state.form.password)}})
        .then(response =>{
            console.log("response.data")
            console.log(response.data);    
            return response.data;                    
        })
        .then ( response => {
            // El inicio de sesion es correcto
            if (response.length >0){
                var respuesta = response[0] 
                cookies.set('id', respuesta.id, {path:"/"} )
                cookies.set('apellido_paterno', respuesta.apellido_paterno, {path:"/"} )
                cookies.set('apellido_matero', respuesta.apellido_materno,  {path:"/"} )
                cookies.set('nombre', respuesta.nombre,  {path:"/"} )
                cookies.set('username', respuesta.nombre,  {path:"/"} )
                //mensaje de bienvenida
                alert(`Bienvenido ${respuesta.nombre} ${respuesta.apellido_paterno}`)
                // redirigimos al usuario al menu
                window.location.href="./menu"

            }
            else{
             alert("No se pudo iniciar: usuario o contraseña incorrectos")
            }   
        }

        )
        .catch(error=>{
            console.log("error")
            console.log(error);
        })
    }

    componentDidMount() {

        
        if (cookies.get('username')){
            window.location.href="./menu"
        }
    }


        
    render() {
        if (!cookies.get('username')) {
        return (
            <div className='containerPrincipal'>
                <div className='containerSecundario'>
                    <div className='form-group'>
                        <label>Usuario:</label>
                        <br />
                        <input type='text' className='form-control' name='username' onChange={this.handleChange}/>

                       
                        <br />
                        <label>Contraseña:</label>
                        <br />
                        <input type='password' className='form-control' name='password' onChange={this.handleChange}/>
                       
                        <br />
                        <button className='btn btn-primary' onClick={()=>this.iniciarSesion()} >Iniciar Sesión </button>
                        
                    </div>
                    
                </div>
                
            </div>
        );
       }
    }
}

export default Login;