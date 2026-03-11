import './App.css'
import { Link } from 'react-router-dom';
function Home(){
    return(
        <div>
            <Link to='/profile'>Profile</Link>
            <br/>
            <Link to='/add'>Add Products</Link>
            <br/>
            <Link to='/products'>Products</Link>
            <br/>
            <Link to='/stock'>Stocks</Link>
            <br/>
            <Link to='/salse'>Salse History</Link>
            <h2>This is home Page</h2>
        </div>
    );
}
export default Home