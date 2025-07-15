import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadBookModal from "/UploadBookModal";

function BooksDashboard() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get("/api/books")
            .then(res => setBooks(res.data));
    }, []);

    return (
        <div>
            <UploadBookModal />
            {books.map(book => (
                <div key={book.id}>{book.title} - Uploaded by {book.user?.username}</div>
            ))}
        </div>
    );
}

export default BooksDashboard;
