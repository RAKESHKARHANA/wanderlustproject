import React, { Component } from 'react';
import axios from 'axios';
import {backendUrlBooking} from '../BackendURL'
import { Link, Redirect } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class viewBookings extends Component {
    constructor(props) {
        super(props)
        this.state = {
             bookings:[],
             errorMessage:'',
             showLogin:false,
             displayDialog:false,
             currentBook:''
        }
    }
    componentWillMount=()=>{
        let userID=sessionStorage.getItem('userId')
        if(userID){
            axios.get(`${backendUrlBooking}/${userID}`)
            .then(bookings=>{
                this.setState({bookings:bookings.data},()=>{console.log(this.state.bookings)})
            })
        }else{
            this.setState({showLogin:true})
        }
    }
    confirmRefund=(booking)=>{
        this.setState({currentBook:booking, displayDialog:true},()=>{console.log(this.state.currentBook)})
    }
    onHide = (event) => {
        this.setState({ displayDialog: false });
    }
    //for deleting the booking
    cancelPackage=()=>{
        let body={
            'destinationId':this.state.currentBook.destId,
            'noOfPersons':this.state.currentBook.noOfPersons
        }
        axios.post(`${backendUrlBooking}/${this.state.currentBook.bookingId}`,body)
            .then(res=>{
                console.log(res)
            }).catch(err=>{console.log(err)})
        this.setState({littleBuddy:true})
    }
    render() {
        const footer = (
            <div >
              <Button label="BACK" className='btn' onClick={this.onHide} style={{backgroundColor:'light blue'}} />
              <Button label="CONFIRM CANELLATION" className='btn' onClick={this.cancelPackage}style={{backgroundColor:'grey'}}  />
            </div>
          );
        if(this.state.showLogin){
            return<div style={{margin:'223px 0'}}>
                <h4 className="text display-4 text-info">Please login for viewing your bookings</h4>
                <button className='btn btn-secondary btn-lg'><Link style={{color:'white',textDecoration:'none'}}to='/login'>Click Here To Login</Link></button>
             </div>
        }
        if(this.state.bookings.length===0){
            return<div className='container'style={{textAlign:'left'}}>
                <div style={{margin:'223px 0'}}>
                <h3 className='text text-dark'>Sorry!! You have not planned any trips with us yet </h3>
                <button style={{marginTop:'35px'}} className='btn btn-lg btn-success'><Link style={{color:'white',textDecoration:'none'}}to='/'>CLICK HERE TO BOOKING</Link></button>
                </div>
            </div>            
            
        }
        return <div className='container' style={{marginTop:'90px'}}>
         
            {this.state.bookings.map(book=>{
                return (<div className='card col-8 offset-2 mt-4' style={{textAlign:'left',border:'none'}}key={book.bookingId}>
                    <div className='card-header font-weight-bold'>Booking Id:{book.bookingId}</div>
                    <div className='row card-body'>
                        <h4 className='text-dark'>{book.destinationName}</h4>
                        <div className='col-7 text-secondary'>
                        <h5 >Trip starts on:{new Date(book.checkInDate).toLocaleDateString()}</h5>
                        <h5>Trip ends on:{new Date(book.checkOutDate).toLocaleDateString()}</h5>
                        <h5>Travellers:{book.noOfPersons}</h5>
                        </div>
                        <div className='col-5 text-secondary'>
                        <br/>
                        <h5>Fare Derails</h5>
                        <h5>${book.totalCharges.toLocaleString()}.00</h5>
                        <button onClick={()=>{this.confirmRefund(book)}} className='btn-link text-info' style={{backgroundColor:'white',border:'none'}}>Claim Refund</button>
                        </div>
                        
                    </div>
                    
                </div>)
            })}
           {this.state.displayDialog? <Dialog
        header="Confirmation Cancellation"
        visible={this.state.displayDialog}
        style={{ width: '50vw' }}
        footer={footer}
        onHide={this.onHide}
        maximizable
        >
        <div style={{textAlign:'left'}}>
        Trip starts on:{new Date(this.state.currentBook.checkInDate).toLocaleDateString()}<br/>
        Trip ends on:{new Date(this.state.currentBook.checkOutDate).toLocaleDateString()}<br/>
        Refund Amount:${this.state.currentBook.totalCharges.toLocaleString()}.00
        </div>
        
        </Dialog>:null}
        {this.state.littleBuddy?
        <Dialog style={{width:'30vw',backgroundColor:'red'}} visible={this.state.littleBuddy}
        onHide={()=>{this.setState({littleBuddy:false})}}>
            <h6 style={{textAlign:'left'}}>Successfully deleted the booking with Id:{this.state.currentBook.bookingId}</h6>
            <button className='btn btn-dark'><Link style={{color:'white',textDecoration:'none'}}to='/'>HOMEPAGE</Link></button>
        </Dialog>:null
        }
        </div>
        
        
    
    }
}

export default viewBookings
