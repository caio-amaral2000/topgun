import { useState, useEffect } from 'react';
import { Spinner } from 'components';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { InstructedFlights };

function InstructedFlights(props) {
    const pilotId = props?.pilotId;

    const [flights, setFlights] = useState(null);

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        userService.getInstructedFlights(pilotId)
            .then(x => setFlights(x))
            .catch(alertService.error)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Start date</th>
                        <th style={{ width: '30%' }}>Duration</th>
                        <th style={{ width: '20%' }}>Pilot</th>
                        <th style={{ width: '20%' }}>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {flights && flights.map(flight =>
                        <tr>
                            <td>{flight.start_date}</td>
                            <td>{flight.duration}</td>
                            <td>{flight.pilot}</td>
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