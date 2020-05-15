import React,{Component} from 'react';
import{Link} from 'react-router-dom'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InputSwitch } from 'primereact/inputswitch';
import Axios from 'axios';
import{backendUrlBooking} from '../BackendURL'



export class confirmBooking extends Component {
    constructor(props) {
        super(props)    
        this.state =this.props.location.state       
    }
    componentWillMount(){
      console.log(this.state)
    }
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
allInOne=(e)=>{
  this.handleChange(e)
  this.calculateCharges()
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
//package inclusions
displayPackageInclusions = () => {
  const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
  if(this.state.deal) {
      return packageInclusions.map((pack,index)=> (<li style={{marginBottom:"5px",textAlign:"left"}} key={index}>{pack}</li>) )
  }
  else {
      return null;
  }
}
//handle submit
handleSubmit=(e)=>{
  e.preventDefault();
  this.bookingDone();
}
//booking done(make a axios call from here)
bookingDone =()=>{
    let bodyObj={
        "userId":sessionStorage.getItem('userId'),
        "destId":this.state.deal.destinationId,
        "destinationName":this.state.deal.name,
        "checkInDate":this.state.bookingForm.date,
        "checkOutDate":this.state.checkOutDate,
        "noOfPersons":this.state.bookingForm.noOfPersons,
        "totalCharges":this.state.totalCharges
    }
    Axios.post(`${backendUrlBooking}/${sessionStorage.getItem('userId')}/${this.state.deal.destinationId}`,bodyObj)
        .then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)            
        })
  this.setState({showSuccess:true})
}
render() {
    if(this.state.showSuccess){
      return(<div style={{margin:'185px 0px'}}>
        <h1>Booking Confirmed!!</h1>
        <h2 className='text-success'>Congratulations! Trip planned to {this.state.deal.name}</h2>
        <h4>Trip starts on:{new Date( this.state.bookingForm.date).toLocaleDateString()}</h4>
        <h4>Trip starts on:{this.state.checkOutDate.toLocaleString()}</h4>
        <Link to='/viewBookings'className='text-primary' style={{textDecoration:'none'}}>Click here to view your bookings.</Link>
      </div>)
    }
    return (
        <div style={{float:'center',margin:'auto',marginTop:'50px',padding:'40px 0px'}}className='row container' >
        <div className='col-7'>
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <h2 style={{color:'#709c9c'}}>Overview</h2>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails style={{textAlign:'left'}}>{this.state.deal.details.about}</ExpansionPanelDetails>
  </ExpansionPanel>
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header" >
      <h2 style={{color:'#709c9c'}}>Package Inclusions</h2>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails><div><ul style={{listStylePosition:'outside'}}>{this.displayPackageInclusions()}</ul></div></ExpansionPanelDetails>
  </ExpansionPanel>
  <ExpansionPanel >
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}aria-controls="panel3a-content" id="panel3a-header">
      <h2 style={{color:'#709c9c'}}>Itinerary</h2>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails><div>{this.displayPackageHighlights()}</div></ExpansionPanelDetails>
  </ExpansionPanel>
  </div>
  <div className='border rounded col-4 offset-1'>
  <form onSubmit={this.handleSubmit}>
      <div className="form-group">
          <label className='form-inline'htmlFor="noOfPersons">Number of Travelers:</label>
          <input
              type="number"
              id="noOfPersons"
              className="form-control"
              name="noOfPersons"
              value={this.state.bookingForm.noOfPersons}
              onChange={this.allInOne}
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
            onChange={this.allInOne}
        />
        {this.state.bookingFormErrorMessage.dateError ?
            <div className="text-danger">{this.state.bookingFormErrorMessage.dateError}</div>
            : null}
    </div>
    <div className="form-group form-inline">
        <label>Include Include Flights:</label>&nbsp;
        <InputSwitch name="flights" id="flights"
            checked={this.state.bookingForm.flights}
            onChange={this.allInOne} />
    </div>
    <div>
          {this.state.bookingFormValid.buttonActive?
        <h5 className="text-success" style={{textAlign:"left",fontSize:'18px'}}>
            Your trip ends on {this.state.checkOutDate.toLocaleString()} and
            you will pay ${this.state.totalCharges.toLocaleString()}.00
        </h5>:null}
    </div>
    <div className="text-center" style={{marginBottom:'20px'}}>
    <button  disabled={!this.state.bookingFormValid.buttonActive}style={{padding:'15px 25px',fontSize:'10px',float:'left',backgroundColor:'#709c9c',color:'white'}}className="btn">CONFIRM BOOK</button>
    &nbsp; &nbsp;
    <button type="button" className="btn" style={{backgroundColor:'#709c9c',fontSize:'10px',color:'white',padding:"15px 25px"}}><Link to='/' style={{color:"white",textDecoration:'none'}}>Cancel</Link></button>
    </div>
    </form>
    </div>
    </div>
    )
}
}

export default confirmBooking
