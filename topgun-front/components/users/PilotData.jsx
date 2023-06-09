import { FlightCreation, Graduate, InstructedFlights, Promote } from "components/popup";
import {Popup} from 'reactjs-popup';
import { userService } from "services";

export { PilotData };

function PilotData(props){
    const pilotData = props.pilotData
    const flights = pilotData.flights

    const profileLabel = {
        'STU': 'Student',
        'PIL': 'Pilot',
        'INS': 'Instructor',
    }

    function canCreateFlight(){
        if(pilotData.user.profile === 'STU'){
            return userService.hasRole(['INS'])
        } else {
            return userService.hasRole(['EMP'])
        }
    }

    return (
        <div>
            <form>
                <h2>Pilot Information</h2>
                <div className="form-row">
                    <div className="form-group col">
                        <label>Id</label><br></br>
                        <input type="number" name="id" value={pilotData.user.id} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Name</label><br></br>
                        <input type="text" name="name" value={pilotData.user.name} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Username</label><br></br>
                        <input type="text" name="username" value={pilotData.user.username} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Profile</label><br></br>
                        <input type="text" name="profile" value={profileLabel[pilotData.user.profile]} readonly />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label>Birth date</label><br></br>
                        <input type="date" name="birth_date" value={pilotData.user.birth_date} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Address</label><br></br>
                        <input type="text" name="main" value={pilotData.user.address.main} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Complement</label><br></br>
                        <input type="text" name="complement" value={pilotData.user.address.complement} readonly />
                    </div>
                </div>
                <div className="form-row"> 
                    <div className="form-group col">
                        <label>Postal code</label><br></br>
                        <input type="text" name="postal_code" value={pilotData.user.address.postal_code} readonly />
                    </div>
                    <div className="form-group col">
                        <label>City</label><br></br>
                        <input type="text" name="city" value={pilotData.user.address.city} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Flight hours</label><br></br>
                        <input type="number" name="flight_hours" value={pilotData.flight_hours} readonly />
                    </div>
                    {pilotData.license_number && <div className="form-group col">
                        <label>License number</label><br></br>
                        <input type="number" name="license_number" value={pilotData.license_number} readonly />
                    </div>}
                </div> 
                {pilotData.instructor_data && <div className="form-row">   
                    <div className="form-group col">
                        <label>Institution name</label><br></br>
                        <input type="text" name="institution_name" value={pilotData.instructor_data.institution_name} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Course name</label><br></br>
                        <input type="text" name="course_name" value={pilotData.instructor_data.course_name} readonly />
                    </div>
                    <div className="form-group col">
                        <label>Graduation date</label><br></br>
                        <input type="date" name="graduation_date" value={pilotData.instructor_data.graduation_date} readonly />
                    </div>
                </div>}
            </form>

            {userService.hasRole(['INS']) && pilotData.flight_hours >= 150 && pilotData.user.profile === 'STU' && <Popup trigger={<button> Graduate student </button>} position="right center">
                <Graduate pilotId={pilotData.user.id} ></Graduate>
            </Popup>}
            {userService.hasRole(['EMP']) && pilotData.user.profile === 'PIL' && <Popup trigger={<button> Promote pilot </button>} position="right center">
                <Promote pilotId={pilotData.user.id} ></Promote>
            </Popup>}
            {pilotData.user.profile === 'INS' && <Popup trigger={<button> See instructed flights </button>} position="right center">
                <InstructedFlights pilotId={pilotData.user.id} ></InstructedFlights>
            </Popup>}

            <h2>Flights</h2>
            {canCreateFlight() && <Popup trigger={<button> Create new flight </button>} position="right center">
                <FlightCreation pilotId={pilotData.user.id} isStudent={pilotData.user.profile === 'STU'}></FlightCreation>
            </Popup>}
            
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Start date</th>
                        <th style={{ width: '30%' }}>Duration</th>
                        <th style={{ width: '20%' }}>Instructor</th>
                        <th style={{ width: '20%' }}>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {flights && flights.map(flight =>
                        <tr>
                            <td>{flight.start_date}</td>
                            <td>{flight.duration}</td>
                            <td>{flight.instructor}</td>
                            <td>{flight.grade}</td>
                        </tr>
                    )}
                    {!flights &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {flights && !flights.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Flights To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
 
    );
}