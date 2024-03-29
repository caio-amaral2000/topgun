import { useState, useEffect } from 'react';

import { NavLink } from '.';
import { userService } from 'services';

import Image from 'next/image';
import logo from "assets/logo.webp";

export { Nav };

function Nav() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const subscription = userService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    function logout() {
        userService.logout();
    }

    // only show nav when logged in
    if (!user) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a class="navbar-brand" href="#">
                <Image
                    src={logo}
                    width={'100'} 
                    height={'42'}
                />
            </a>
            <div className="navbar-nav">
                <NavLink href="/" exact className="nav-item nav-link">Home</NavLink>
                {userService.hasRole(['INS','EMP']) && <NavLink href="/users" className="nav-item nav-link">Users</NavLink>}
                <a onClick={logout} className="nav-item nav-link">Logout</a>
            </div>
        </nav>
    );
}