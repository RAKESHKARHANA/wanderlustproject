import React, { Component } from 'react';
import {backendUrlPackage} from '../BackendURL';
import axios from 'axios'
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import {Redirect} from 'react-router-dom'

class StaticPackage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            bookingForm:{
                noOfPersons:0,
                date:'',
                flights:false
            },
            bookingFormErrorMessage:{
                noOfPersonsError:'',
                dateError:''
            },
            bookingFormValid:{
                noOfPersonsValid:false,
                dateValid:false,
                buttonActive:false
            },
             hotPackages:[],
             totalCharges:'',
             errorMessage:'',
             successMessage:'',
             index:'',
             showItinerary:false,
             deal:'',
             showLogin:false,
             showConfirmBooking:false,
             showSuccess:false,
             showZero:false
        }
    }
    componentWillMount=()=>{
        window.scrollTo(0,0)
        const continent=sessionStorage.getItem('continent');
        if(continent){
            axios.get(`${backendUrlPackage}/${continent}`)
            .then(searchedInfo=>{
                if(searchedInfo.data.length===0){
                    this.setState({showZero:true},()=>{sessionStorage.removeItem('continent')})
                }else{
                    this.setState({hotPackages:searchedInfo.data},()=>{sessionStorage.removeItem('continent')})
                }
            })
        }else{
            axios.get(`${backendUrlPackage}/hotDeals`)
            .then(hotDeals=>{
                this.setState({hotPackages:hotDeals.data})
            })
        }
        
    }
    //handlechange
    handleChange=(event)=>{
        let name=event.target.name
        let value=event.target.value
        let{bookingForm}=this.state
        bookingForm[name]=value
        this.setState({bookingForm:bookingForm})
        this.validateFields(name,value);
    }
    //validating Fields
    validateFields=(fieldname,value)=>{
        let{bookingFormErrorMessage,bookingFormValid}=this.state
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    bookingFormErrorMessage.noOfPersonsError = "This field can't be empty!";
                    bookingFormValid.noOfPersonsValid = false;
                } else if (value < 1 ) {
                    bookingFormErrorMessage.noOfPersonsError = "No. of persons can't be less than 1!";
                    bookingFormValid.noOfPersonsValid = false;
                } else if (value > 5) {
                    bookingFormErrorMessage.noOfPersonsError = "No. of persons can't be more than 5.";
                    bookingFormValid.noOfPersonsValid = false;
                } else {
                    bookingFormErrorMessage.noOfPersonsError = "";
                    bookingFormValid.noOfPersonsValid = true;
                }
                break;
            case "date":
                if (value === "") {
                    bookingFormErrorMessage.dateError = "This field can't be empty!";
                    bookingFormValid.dateValid = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        bookingFormErrorMessage.dateError = "Check-in date cannot be a past date!";
                        bookingFormValid.dateValid = false;
                    } else {
                        bookingFormErrorMessage.dateError = "";
                        bookingFormValid.dateValid = true;
                    }
                }
                break;
            default:
                break;
        }
        bookingFormValid.buttonActive=bookingFormValid.noOfPersonsValid && bookingFormValid.dateValid
        this.setState({bookingFormErrorMessage:bookingFormErrorMessage,bookingFormValid:bookingFormValid})
    }
    //click on view details
    getItinerary = (aPackage) => {
        console.log(aPackage)        
        this.setState({ index: 0, deal: aPackage, showItinerary: true })
    };
    //click on book button
    openBooking = (aPackage) => {
        console.log(aPackage)
        this.setState({ index: 2, deal: aPackage, showItinerary: true })
    };
    //overview block    
    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if(this.state.deal) {
            return packageInclusions.map((pack,index)=> (<li style={{textAlign:'left'}} key={index}>{pack}</li>) )
        }
        else {
            return null;
        }
    }
    //itenrary block
    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0}>
                <h3 style={{textAlign:'left'}}>Day Wise itinerary</h3>
                <h5 style={{textAlign:'left'}}>Day 1</h5>
                {this.state.deal ? <div style={{textAlign:'left'}}>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight,index)=>{
                    let element=(
                        <div key={index+1}>
                        <h5 style={{textAlign:'left'}}>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div style={{textAlign:'left'}}>{packageHighlight}</div>
                    </div>
                    );
                    packageHighLightsArray.push(element)
                });
            let lastElement = (
                <div key={666}>
                    <h5 style={{textAlign:'left'}}>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    <div style={{textAlign:'left'}}>{this.state.deal.details.itinerary.dayWiseDetails.lastDay}</div>
                    <div className="text-danger" style={{textAlign:'left'}}>
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="#contact-us">Contact us</a> for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }
    //calculate charges
    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate=new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + (this.state.deal.flightCharges*(-(-this.state.bookingForm.noOfPersons)));
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }
    }
    //loading the booking 
    loadBookingPage = (dealId) => {
        
        let userId=sessionStorage.getItem('userId')
        if(userId){
        this.setState({ visibleRight: false });
        sessionStorage.setItem('noOfPersons', this.state.bookingForm.noOfPersons);
        sessionStorage.setItem('checkInDate', this.state.bookingForm.date);
        sessionStorage.setItem('flight', this.state.bookingForm.flights);
        sessionStorage.setItem('dealId', dealId);
        sessionStorage.setItem('totalCharges',this.state.totalCharges)
        this.setState({showConfirmBooking:true})
        }
        else{
            console.log('No user logged in')
            alert("Please Login to continue")
            this.setState({showLogin:true})            
        }
    }
    //handle submit
    handleSubmit=(event)=>{
        event.preventDefault();
        this.calculateCharges();
    }
    
    render() {
        if(this.state.showZero){
            return<div className="offset-md-2" style={{margin:'230px 0'}}>
            <h2>Sorry we don't operate in this Destination.</h2><br />
            <a href="/packages" className="btn btn-success">Click Here to checkout our Hot Deals</a>
        </div>
        }
    
       return (<div>
           {/* //to="something/{bla}" render = { () => <NewComp data={data}/>  } */}
           {this.state.showConfirmBooking?<Redirect to={{pathname:`/book/${this.state.deal.destinationId}`,state:this.state}}/>:null}
           {this.state.showLogin ? <Redirect to='/login'/>:null}
           {this.state.hotPackages.map(singlePackage=>{
             return(
                <div className="card bg-light text-dark package-card" style={{border:'none'}} key={singlePackage.destinationId}>
                    <div className="card-body row">
                        <div className="col-md-4">
                            <img className="package-image img-responsive rounded" src={singlePackage.imageUrl} alt="destination comes here" />
                        </div>
                        <div className="col-md-5" style={{borderLeft:'8px #709c9c solid'}}>
                            <div className="featured-text text-center text-lg-left">
                                <h4>{singlePackage.name}</h4>
                                <div className="badge badge-info">{singlePackage.noOfNights}<em> Nights</em></div>
                                {singlePackage.discount ? <div className="discount text-danger">{singlePackage.discount}% Instant Discount</div> : null}
                                <p className="text-dark mb-0">{singlePackage.details.about}</p>
                            </div>
                            <br />
        
                        </div>
                        <div className="col-md-3">
                            <h4>Prices Starting From:</h4>
                            <div className="text-center text-success"><h6>${singlePackage.chargesPerPerson.toLocaleString()}.00</h6></div><br /><br />
                            <div><button className="btn btn-block book"style={{padding:"15px 0px",color:'white',backgroundColor:'#709c9c',fontWeight:'600'}} onClick={() => this.getItinerary(singlePackage)}>View Details</button></div><br />
                            <div><button className="btn btn-block book"style={{padding:'15px 0px',color:'white',backgroundColor:'#709c9c',fontWeight:'600'}} onClick={() => this.openBooking(singlePackage)}>Book </button>  </div>
                        </div>
                    </div>
                </div>
                )
        })}
        <Sidebar visible={this.state.showItinerary} position="right" className="p-sidebar-lg "style={{marginTop:'57px'}} onHide={(e) => this.setState({ showItinerary: false })}>
                    <h2>{this.state.deal.name}</h2>
                    <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })}>
                        <TabPanel header="Overview">
                            <div className="row">
                                {this.state.deal ?
                                    <div className="col-md-6 text-center">
                                        <img className="package-image" src={this.state.deal.imageUrl} alt="destination comes here" />
                                    </div> : null}

                                <div className="col-md-6">
                                    <h4 style={{textAlign:'left'}}>Package Includes:</h4>
                                    <ul>
                                        {this.state.showItinerary ? this.displayPackageInclusions():null}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-justify itineraryAbout">
                                <h4>Tour Overview:</h4>
                                {this.state.deal ? this.state.deal.details.about : null}
                            </div>
                        </TabPanel>
                        <TabPanel header="Itinerary">
                            {this.displayPackageHighlights()}
                        </TabPanel>
                        <TabPanel header="Book">
                            <h4 style={{textAlign:'left'}} className="itenaryAbout text-dark">**Charges per person: ${this.state.deal.chargesPerPerson}</h4>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label className='form-inline'htmlFor="noOfPersons">Number of Travelers:</label>
                                    <input
                                        type="number"
                                        id="noOfPersons"
                                        className="form-control"
                                        name="noOfPersons"
                                        value={this.state.bookingForm.noOfPersons}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.noOfPersonsError ?
                                        <span style={{textAlign:'left'}} className="text-danger">{this.state.bookingFormErrorMessage.noOfPersonsError}</span>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label className='form-inline' htmlFor="date">Trip start Date:</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        name="date"
                                        value={this.state.bookingForm.date}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.dateError ?
                                        <div className="text-danger">{this.state.bookingFormErrorMessage.dateError}</div>
                                        : null}
                                </div>
                                <div className="form-group form-inline">
                                    <label>Include Include Flights:</label>&nbsp;
                                    <InputSwitch name="flights" id="flights"
                                        checked={this.state.bookingForm.flights}
                                        onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <button id="buttonCalc" className="btn btn-lg" style={{padding:'20px 65px',float:'left',fontSize:'10px',backgroundColor:'#709c9c',color:'white'}} type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Calculate Charges</button>&nbsp;
                                </div>
                            </form><br/>
                            
                            {!this.state.totalCharges ?
                                (
                                    <React.Fragment><div style={{textAlign:"left"}}>**Charges Exclude flight charges.</div><br/></React.Fragment>
                                )
                                :
                                (   <div>
                                    <h4 className="text-success">
                                        Your trip ends on {this.state.checkOutDate.toLocaleString()} and
                                        you will pay ${this.state.totalCharges.toLocaleString()}.00
                                    </h4>
                                    </div>
                                )
                            }
                           

                            <div className="text-center">
                                <button disabled={!this.state.totalCharges} style={{padding:'20px',fontSize:'15px',backgroundColor:'#709c9c',color:'white'}}className="btn" onClick={() => this.loadBookingPage(this.state.deal.destinationId)}>Book</button>
                                &nbsp; &nbsp; &nbsp;
                                <button type="button" className="btn btn-link" style={{textDecoration:"none",backgroundColor:'#709c9c',fontSize:'15px',color:'white',padding:"20px"}}onClick={(e) => this.setState({showItinerary:false})}>Cancel</button>
                            </div>
                        </TabPanel>
                    </TabView>
                </Sidebar>
        </div>
        
        )
        
    }

}

export default StaticPackage;