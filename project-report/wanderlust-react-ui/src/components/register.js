import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';




export class Register extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             registerform:{
                 name:'',
                 emailId:'',
                 contactNo:'',
                 password:''
             },
             registerformErrorMessage:{
                nameError:'',
                emailIdError:'',
                contactNoError:'',
                passwordError:''
             },
             registerformValid:{
                 nameValid:false,
                 emailIdValid:false,
                 contactNoValid:false,
                 passwordValid:false,
                 buttonActive:false
             },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,

        }
    }
    handleChange=(event)=>{
        let name=event.target.name
        let value=event.target.value
        let{registerform}=this.state
        registerform[name]=value
        this.setState({registerform:registerform})
        this.validateFields(name,value);
    }
    validateFields=(fieldName,value)=>{
        let{registerformErrorMessage,registerformValid}=this.state
        switch(fieldName){
            case'name':
                if(value===''){
                    registerformErrorMessage.nameError='Field required'
                    registerformValid.nameValid=false
                }else if(!value.match(/^[A-z]+(\s[A-z]+)*$/)){
                    registerformErrorMessage.nameError='Please enter a valid name'
                    registerformValid.nameValid=false
                }else{
                    registerformErrorMessage.nameError=''
                    registerformValid.nameValid=true
                }break;
            case'emailId':
                if(value===''){
                    registerformErrorMessage.emailIdError='Field required';
                    registerformValid.emailIdValid=false;
                }else if(!value.match(/^[A-z0-9]+@[A-z]+.[A-z]+$/)){
                    registerformErrorMessage.emailIdError='Please enter a valid email Id';
                    registerformValid.emailIdValid=false;
                }else{
                    registerformErrorMessage.emailIdError='';
                    registerformValid.emailIdValid=true;
                }break;
            case'contactNo':
                if(value===''){
                    registerformErrorMessage.contactNoError='Field required'
                    registerformValid.contactNoValid=false
                }else if(value.length!==10){
                    registerformErrorMessage.contactNoError='Contact number should be a valid 10 digit number'
                    registerformValid.contactNoValid=false
                }
                
                else{
                    registerformErrorMessage.contactNoError=''
                    registerformValid.contactNoValid=true
                }
                this.checkContaNo(value);
                break;
            case'password':
                if(value===''){
                    registerformErrorMessage.passwordError='Field required';
                    registerformValid.passwordValid=false;
                }else if(!(value.length>=7 && value.length<=20&&value.match(/[-!@#$%^&*]/)&& value.match(/[A-Z]/) &&value.match(/[0-9]/) && value.match(/[a-z]/))){
                    registerformErrorMessage.passwordError='Please enter a valid password'
                    registerformValid.passwordValid=false;
                }
                 else{
                    registerformErrorMessage.passwordError=''
                    registerformValid.passwordValid=true
                }
                
                break;
            default:
                break;
                
        }
        registerformValid.buttonActive=registerformValid.nameValid && registerformValid.emailIdValid 
                                        && registerformValid.contactNoValid && registerformValid.passwordValid;
        this.setState({registerformErrorMessage:registerformErrorMessage,registerformValid:registerformValid})
    }
    handleSubmit=(event)=>{
        event.preventDefault();
        this.register();
    }
    register=()=>{
        let newUser=this.state.registerform
        axios.post(`${backendUrlUser}/register`,newUser)
            .then(response=>{
                console.log(response.data)
                this.setState({successMessage:"Successfully Registered"})
            })
            .catch(err=>{
                console.log(err)
                this.setState({errorMessage:'Registration failed! Please try again'})
            })
    }
    checkContaNo=(contactNo)=>{
        let contactObj={contactNo:contactNo}
        let{registerformErrorMessage,registerformValid}=this.state
        axios.post(`${backendUrlUser}/checkuser`,contactObj)
            .then(res=>{
                if(res.data){
                    registerformErrorMessage.contactNoError='Number already present' 
                    registerformValid.contactNoValid=false                   
                    this.setState({registerformErrorMessage:registerformErrorMessage,registerformValid:registerformValid})
                }               
            })
    }


    render() {
        if(!this.state.successMessage==""){
            return<div className='col-4 offset-4'style={{paddingTop:200,paddingBottom:200}} >
                <h2 className='text text-success' style={{float:'left'}}>{this.state.successMessage}</h2>
                <h2 className='text text-info'style={{float:'left'}}><Link to='/login'>Click here to login</Link></h2>
            </div>
        }
        if(!this.state.errorMessage==""){
            return <div className='col-4 offset-4'style={{paddingTop:200,paddingBottom:200}}>
                <h2 className='text text-danger'>{this.state.errorMessage}</h2>
            </div>
        }
        return (
            <div>
                
                <section id="registerPage" className="registerSection">    
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 ">
                                <h1 className='form-inline'>Join us</h1>
                                <form className="form" onSubmit={this.handleSubmit}> 
                                    <div className="form-group">
                                        <label className='form-inline'htmlFor="name">Name<span className="text-danger">*</span></label>
                                        <input onChange={this.handleChange} name='name'type='text' id='name'className='form-control' value={this.state.registerform.name} />
                                    </div>
                                    <span className='text-danger form-inline'>{this.state.registerformErrorMessage.nameError}</span>

                                    <div className="form-group">
                                        <label className='form-inline'htmlFor="emailId">Email Id<span className="text-danger">*</span></label>
                                        <input onChange={this.handleChange}name='emailId' type='email' className='form-control' value={this.state.registerform.emailId} />
                                    </div>
                                    <span className='text-danger form-inline' >{this.state.registerformErrorMessage.emailIdError}</span>
                                    <div className='form-group'>
                                        <label className='form-inline'htmlFor='contactNo'>Contact Number<span className='text-danger'>*</span></label>
                                        <input onChange={this.handleChange}type='number' name='contactNo' value={this.state.registerform.contactNo} className='form-control'  />
                                    </div>
                                    <span className='text-danger form-inline'>{this.state.registerformErrorMessage.contactNoError}</span>
                                    <div className='form-group'>
                                        <label htmlFor='password'className='form-inline'>Password<span className='text-danger'>*</span></label>
                                        <input onChange={this.handleChange}className='form-control' name='password' type='password' value={this.state.registerform.password} />
                                    </div>
                                    <span  className='text-danger form-inline'>{this.state.registerformErrorMessage.passwordError}</span><br/>
                                    <span className='form-inline'><span className="text-danger">*</span> marked feilds are mandatory</span>
                                    <br />
                                    <button
                                        type="submit"
                                        disabled={!this.state.registerformValid.buttonActive}
                                        className="btn btn-block"
                                        style={{padding:'15px 0px',backgroundColor:'#709c9c',color:'white'}}
                                        
                                    >
                                        REGISTER
                                    </button>
                                </form>
                                <br />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Register
