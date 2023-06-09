import { userService } from 'services';
import { Link } from 'components';

export default Home;

function Home() {
    const user = userService.userValue
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {user.name}!</h1>
                <p>Welcome to TOPGUN!</p>
                {userService.hasRole(['STU','PIL','INS']) && <p><Link href={`/users/edit/${user.id}`}>See your pilot information</Link></p>}
            </div>
        </div>
    );
}
