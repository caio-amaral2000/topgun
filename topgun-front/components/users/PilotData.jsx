export { PilotData };

function PilotData(props){
    const pilotData = props.pilotData

    const profileLabel = {
        'STU': 'Student',
        'PIL': 'Pilot',
        'INS': 'Instructor',
    }

    return (
        <form>
            <h2>User data</h2>
            <div className="form-group">
                <label>Id</label><br></br>
                <input type="number" name="id" value={pilotData.user.id} readonly />
            </div>
            <div className="form-group">
                <label>Name</label><br></br>
                <input type="text" name="name" value={pilotData.user.name} readonly />
            </div>
            <div className="form-group">
                <label>Username</label><br></br>
                <input type="text" name="username" value={pilotData.user.username} readonly />
            </div>
            <div className="form-group">
                <label>Profile</label><br></br>
                <input type="text" name="profile" value={profileLabel[pilotData.user.profile]} readonly />
            </div>
            <div className="form-group">
                <label>Birth date</label><br></br>
                <input type="date" name="birth_date" value={pilotData.user.birth_date} readonly />
            </div>
            <div className="form-group">
                <label>Address</label><br></br>
                <input type="text" name="main" value={pilotData.user.address.main} readonly />
            </div>
            <div className="form-group">
                <label>Complement</label><br></br>
                <input type="text" name="complement" value={pilotData.user.address.complement} readonly />
            </div>
            <div className="form-group">
                <label>Postal code</label><br></br>
                <input type="text" name="postal_code" value={pilotData.user.address.postal_code} readonly />
            </div>
            <div className="form-group">
                <label>City</label><br></br>
                <input type="text" name="city" value={pilotData.user.address.city} readonly />
            </div>
        </form>
    );
}