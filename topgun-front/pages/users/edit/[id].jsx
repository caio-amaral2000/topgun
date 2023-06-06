import { useState, useEffect } from 'react';
import { Layout, AddEdit } from 'components/users';
import { Spinner } from 'components';
import { userService, alertService } from 'services';
import { useRouter } from 'next/router';

export default Edit;

function Edit({ id }) {
    const [pilotData, setPilotData] = useState(null);

    const router = useRouter()
    const user = router.query

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        userService.getPilotData(id)
            .then(x => setPilotData(x))
            .catch(alertService.error)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <h1>Edit User</h1>
            {user ? <AddEdit user={user} /> : <Spinner /> }
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id }
    }
}
