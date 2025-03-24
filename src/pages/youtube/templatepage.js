import axios from 'axios';
import "./template.css";
import React, { useState, useEffect } from 'react';

const TemplatePage = () => {
    const [items, setItems] = useState([]);
    let [addItem, setAddItem] = useState(false);
    let [editItem, setEditItem] = useState(false);
    let [searchItem, setSearchItem] = useState("");
    let [noItem, setNoItem] = useState(false);
    let [hideSearchBar, setHideSearchBar] = useState(true);
    const [newItem, setNewItem] = useState({ link: "", name: "" });
    const [editItemData, setEditItemData] = useState({ id: "", link: "", name: "" });

    useEffect(() => {
        axios.get('http://localhost:27017/items')
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error('There was an error fetching the items', error);
            });
    }, []);

    const handleInputChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };
    
    const handleEditChange = (e) => {
        setEditItemData({ ...editItemData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        axios.post('http://localhost:27017/item', newItem)
            .then((response) => {
                setItems([...items, response.data]);
                setNewItem({ link: "", name: "" });
                setAddItem(false);
            })
            .catch((error) => console.log("Error adding item", error));
    };

    const handleEdit = () => {
        axios.put(`http://localhost:27017/item/${editItemData.id}`, {
            link: editItemData.link,
            name: editItemData.name
        })
            .then(response => {
                alert(response.data.message);
                window.location.reload();
            })
            .catch(error => console.log(error.message));
    };

    const findItem = (query) => {
        setSearchItem(query);
        axios.get(`http://localhost:27017/item/${query}`)
            .then((response) => {
                if (!response.data) {
                    setSearchItem("");
                    setNoItem(false);
                    setHideSearchBar(true);
                } else {
                    setNoItem(false);
                    setItems(response.data);
                }
            })
            .catch(() => {
                setNoItem(true);
                if (query === "") setHideSearchBar(true);
            });
    };

    const deleteItem = (id) => {
        axios.delete(`http://localhost:27017/item/${id}`)
            .then(() => {
                alert("Deleted item");
                window.location.reload();
            })
            .catch((error) => console.log(error.message));
    };

    return (
        <div>
            {addItem && (
                <div className="fullpage">
                    <div className="formpage">
                        <button className="button" onClick={() => setAddItem(false)}>x</button>
                        <form onSubmit={handleSubmit}>
                            <label>Link:</label>
                            <input type="text" name="link" value={newItem.link} onChange={handleInputChange} required />
                            <label>Name:</label>
                            <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required />
                            <input type="submit" value="Add" className="submit" />
                        </form>
                    </div>
                </div>
            )}

            {editItem && (
                <div className="fullpage">
                    <div className="formpage">
                        <button className="button" onClick={() => setEditItem(false)}>x</button>
                        <div dangerouslySetInnerHTML={{ __html: editItemData.link }}></div>
                        <form onSubmit={handleEdit}>
                            <label>Link:</label>
                            <input type="text" name="link" value={editItemData.link} onChange={handleEditChange} required />
                            <label>Name:</label>
                            <input type="text" name="name" value={editItemData.name} onChange={handleEditChange} required />
                            <input type="submit" value="Edit" className="submit" />
                        </form>
                    </div>
                </div>
            )}

            <div className="controlbar">
                <button className="searchbtn" onClick={() => setHideSearchBar(false)}>🔍</button>
                {!hideSearchBar && <input className="searchbar" onChange={(e) => findItem(e.target.value)} />}
                <button className="button" onClick={() => setAddItem(true)}>+ Add New Item</button>
            </div>

            {noItem && searchItem && <div className="searchresultmsg">No results for "{searchItem}"</div>}

            <div className="content">
                {!noItem && searchItem === "" && items.map((item) => (
                    <div className="item" key={item._id}>
                        <div dangerouslySetInnerHTML={{ __html: item.link }}></div>
                        <div className="description">
                            <div className="name">{item.name}</div>
                            <div className="actions">
                                <button onClick={() => deleteItem(item._id)}>Delete</button>
                                <button onClick={() => { setEditItem(true); setEditItemData({ id: item._id, link: item.link, name: item.name }); }}>Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplatePage;
