// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

const characters = [
    {
        name: "Charlie",
        job: "Janitor"
    },
    {
        name: "Mac",
        job: "Bouncer"
    },
    {
        name: "Dee",
        job: "Aspring actress"
    },
    {
        name: "Dennis",
        job: "Bartender"
    }
];

function MyApp() {
    const [characters, setCharacters] = useState([]);

    const removeCharacter = (id) => {
        removeOneCharacter(id)
            .then((res) => {
                if(res.status === 404) {
                    throw new Error(("Resource not found"));
                }

                if(res.status !== 204) {
                    throw new Error("Deletion not complete");
                }
                setCharacters((characters) =>
                    characters.filter((character) => character.id !== id)
                );
            });
    }

    function removeOneCharacter(id) {
        const promise = fetch(`http://localhost:8000/users/${id}`, {
            method: "DELETE",
        });
        return promise;
    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status !== 201)
                    throw new Error("No changes made");
                return res.json();
            })
            .then((newPerson) => {
                setCharacters([newPerson, ...characters])
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] );

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });
        return promise;
    }

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;