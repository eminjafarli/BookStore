import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axios.get(`/api/users/${id}`)
            .then(res => setProfile(res.data));
    }, [id]);

    return (
        <div>
            {profile && (
                <>
                    <h2>{profile.name} {profile.surname}</h2>
                    <h3>Books:</h3>
                    {profile.books.map(book => (
                        <div key={book.id}>{book.title}</div>
                    ))}
                </>
            )}
        </div>
    );
}

export default UserProfile;
