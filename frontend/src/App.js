import React from 'react';
import './App.css';
import axios from 'axios';
import FlatList from 'flatlist-react';
import * as ReactBootStrap from 'react-bootstrap';
// import ReactSearchBox from 'react-search-box'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      mac:0,
      searchTerm: '',
      players : []
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:10010/films?page=1&limit=7`,{headers : {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  })
      .then(res => {
        // const players = res.data;
        console.log(res);
        this.setState({ players:res.data.data,max:res.data.filteredRecords/5 });
      }).catch (error => {
        console.log('.....error........',error);
      })
  }
  editSearchTerm = (e) => {
    this.setState({searchTerm : e.target.value})
  }
  renderPlayer = (player,index) => {
    
    return(
      <tr key = {index}>
        <td>{player.track}</td>
        <td>{player.album}</td>
        <td>{player.genre}</td>
        <td>{player.bytes}</td>
        <td>{player.composer}</td>
        <td>{player.media_type}</td>
        <td>{player.milliseconds}</td>
        <td>{player.unit_price}</td>
      </tr>
    )
  }
  render() {
    
    const filteredData = ()=> {
      axios.get(`http://localhost:10010/films?page=1&limit=7&filter=name&search=break`,{headers : {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    })
        .then(res => {
          // const players = res.data;
          console.log(res);
          this.setState({ players:res.data.data });
        }).catch (error => {
          console.log('.....error........',error);
        })
    
    } 
    const previous = ()=> {
      let previous_page = this.state.current_page - 1
      if(previous_page<1){
        previous_page = 1
      }
      axios.get(`http://localhost:10010/films?page=`+previous_page+`&limit=7`,{headers : {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    })
        .then(res => {
          // const players = res.data;
          console.log(res);
          this.setState({ players:res.data.data,current_page : previous_page });
        }).catch (error => {
          console.log('.....error........',error);
        })
    
    } 
    const next = ()=> {
      let next_page = this.state.current_page + 1
      console.log('.max.....',this.state.max);
      if(next_page>this.state.max){
        next_page = this.state.max
      }else{
        
      }
      axios.get(`http://localhost:10010/films?page=`+next_page+`&limit=7`,{headers : {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    })
        .then(res => {
          // const players = res.data;
          console.log(res);
          this.setState({ players:res.data.data,current_page:next_page});
        }).catch (error => {
          console.log('.....error........',error);
        })
    
    } 
    return (
      <div className="App">
      {/* <input type = 'text' value = {this.state.searchTerm} onChange = {this.editSearchTerm} placeholder = 'Search' /> */}
      {/* <button onClick = {filteredData}>Search</button> */}
      
      <ReactBootStrap.Table striped bordered hover variant="dark" className = 'table'>
  <thead>
    <tr>
      <th>Track</th>
      <th>Album</th>
      <th>Genre</th>
      <th>Bytes</th>
      <th>Composer</th>
      <th>Media Type</th>
      <th>Milli Seconds</th>
      <th>Unit Price</th>
    </tr>
  </thead>
  <tbody>
    <FlatList
            list={this.state.players}
            renderItem={this.renderPlayer}
            renderWhenEmpty={() => <div>List is empty!</div>}
            sortBy={["track", {key: "track", ascending: true}]}
            // groupBy={person => person.info.age > 18 ? 'Over 18' : 'Under 18'}
          />
      {/* {this.state.players.map(this.renderPlayer)} */}
    </tbody>
  </ReactBootStrap.Table>
  <button type="button" class="btn btn-primary active" onClick = {previous}>Previous</button>
  {this.state.current_page}
  <button type="button" class="btn btn-primary active" onClick = {next}>Next</button>
  {/* <button class="button button2">Blue</button> */}
    </div>
    );
  }
}
// function App() {
  // const data = () => {
  //   Axios.get("https://official-joke-api.appspot.com/random_joke")
  //   .then((response) => response.json())
  //   .then((data) => {
      
  //   })
    
  // }
//   const [count, setCount] = useState(0);
  // const players = [
  //   {position: "hdf", name: "jland", team: "a,msn"},
  //   {position: "skjdn", name: "asd", team: "mnb"},
  //   {position: "nmbc", name: "nsab", team: "ndbkj"},
  //   {position: "lkajd", name: "jhj", team: "jaHDL"},
  //   {position: "mxncv,m", name: "jsahd", team: "LKASHD"},
  // ]
  // const renderPlayer = (player,index) => {
  //   return(
  //     <tr key = {index}>
  //       <td>{player.position}</td>
  //       <td>{player.name}</td>
  //       <td>{player.team}</td>
  //     </tr>
  //   )
  // }
//   return (
//     <div className="App">
//       <button>Fetch</button>
//       <ReactBootStrap.Table striped bordered hover variant="dark">
//   <thead>
//     <tr>
//       <th>First Name</th>
//       <th>Last Name</th>
//       <th>Username</th>
//     </tr>
//   </thead>
//   <tbody>
//     {players.map(renderPlayer)}
//   </tbody>
// </ReactBootStrap.Table>
//     </div>
//   );
// }

export default App;
