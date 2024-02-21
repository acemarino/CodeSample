 {/*search bar to type in to get search value */} 
import React, { useState, useEffect } from 'react';

const Searchbar = props =>{
//set up intial state for search
const getInitialState = () => {
    const value = "Brand";
    return value;
    };

    //set states
const [search, setSearch] = useState("");
const [data, setData] = useState([]);
const [value, setValue] = useState(getInitialState);
const handleChange = (e) => {
    setValue(e.target.value);
  };

//submit funtionc with fetch request, that takes in a search category and a value
let handleSubmit = async (e) => {
  e.preventDefault();
    console.log(value);
        fetch('http://localhost:3001/get',{
            method: "POST",
            body: JSON.stringify({
                search: search, //category(brand, country, etc..)
                value: value //value(indomei, japan, etc...)
            }),
            // set headers  to get a JSON in return
            headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json"
            }
          })
        .then((response)=>response.json())
        .then((data) => {
          
          //print to console what data received
          console.log(data);
          
          setData(data);
          
          // print after setData to check match
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
      
        useEffect(() => {
          fetchData();
        }, []);
   
    // don't perform default action    
    e.preventDefault();
};


  return (
  <>
    <div className='searchBar'>
      <form  onSubmit={handleSubmit} className='formFormat'>
        
        {/*dropdown for category select */} 
        <div className="dropdown-container">
          <select value={value} onChange={handleChange} className='optDropdown'>
            <option value="Brand">
              Brand
            </option>
            <option value="Country">
              Country
            </option>
            <option value="Name">
              Name
            </option>
            <option value="Rating">
              Rating
            </option>
            <option value="Restaurant">
              Restaurant
            </option>
          </select>
        </div>
        
        {/*search bar to type in to get search value */} 
        <div className='searchFunc'>
          <input
            type="text"
            placeholder="Enter search term here"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
    </div>
     
    {/*Results table*/} 
    <div>
      <table id="myTable">
        <tbody>
          <tr>
            <th>Reviewer</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Country</th>
            <th>Style</th>
            <th>Rating</th>
          </tr>

        {/* apply .map() method to iterate through data array in order to render a table of results */} 
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.reviewer}</td>
            <td>{item.name}</td>
            <td>{item.brand}</td>
            <td>{item.country}</td>
            <td>{item.style}</td>
            <td>{item.rating}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  </>
  );
}
export default Searchbar;